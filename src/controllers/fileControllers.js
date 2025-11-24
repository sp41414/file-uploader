const prisma = require("../db/prisma");
const supabaseClient = require("../storage/supabaseClient");
const multer = require("../storage/multerConfig");

const newFilePost = async (req, res, next) => {
  multer(req, res, async (err) => {
    if (err && err.code === "LIMIT_FILE_SIZE") {
      return res.render("newFile", {
        title: "Upload Files",
        errors: [{ msg: "File upload limit exceeded (40 MB)" }],
        folder: req.params.id,
      });
    }
    if (err) {
      console.error(err);
      return res.render("newFile", {
        title: "Upload Files",
        errors: [{ msg: err.message }],
        folder: req.params.id,
      });
    }
    if (!req.file || !req.user) return res.redirect("/");
    try {
      const fileBuffer = req.file.buffer;
      const uniqueFileName = `${req.user.id}/${Date.now()}_${
        req.file.originalname
      }`;

      const { data, error: uploadError } = await supabaseClient.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .upload(uniqueFileName, fileBuffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        return next(uploadError);
      }

      const {
        data: { publicUrl },
      } = supabaseClient.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(data.path);

      await prisma.files.create({
        data: {
          name: req.file.originalname,
          size: req.file.size,
          url: publicUrl,
          path: data.path,
          usersId: req.user.id,
        },
      });
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  });
};

const deleteFileGet = async (req, res, next) => {
  if (!req.user) return res.redirect("/");
  const fileId = req.params.id;
  try {
    const file = await prisma.files.findFirst({
      where: {
        id: fileId,
      },
    });
    const { data, error } = await supabaseClient.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .remove([file.path]);
    if (error) next(error);
    await prisma.files.delete({
      where: {
        id: fileId,
      },
    });
    return res.redirect("/");
  } catch (err) {
    next(err);
  }
};

const newFolderPost = async (req, res, next) => {
  if (!req.user) return res.redirect("/");
  try {
    await prisma.folders.create({
      data: {
        name: req.body.folder,
        usersId: req.user.id,
      },
    });
    return res.redirect("/");
  } catch (err) {
    next(err);
  }
};

const newNestedFolderPost = async (req, res, next) => {
  if (!req.user) return res.redirect("/");
  try {
    await prisma.folders.create({
      data: {
        name: req.body.folder,
        usersId: req.user.id,
        parentId: req.params.id,
      },
    });
    return res.redirect(`/folder/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

const newNestedFilePost = async (req, res, next) => {
  multer(req, res, async (err) => {
    if (err) return next(err);
    if (!req.file || !req.user) return res.redirect("/");

    try {
      const uniqueFileName = `${req.user.id}/${Date.now()}_${req.file.originalname}`;

      const { data, error } = await supabaseClient.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .upload(uniqueFileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) return next(error);

      const {
        data: { publicUrl },
      } = supabaseClient.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(data.path);

      await prisma.files.create({
        data: {
          name: req.file.originalname,
          size: req.file.size,
          url: publicUrl,
          path: data.path,
          usersId: req.user.id,
          foldersId: req.params.id,
        },
      });
      res.redirect(`/folder/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  });
};

const deleteFolderGet = async (req, res, next) => {
  if (!req.user) return res.redirect("/");
  try {
    // recursively delete everything within a folder (i hate recursion aaaaa)
    let paths = [];
    let queue = [req.params.id];

    while (queue.length > 0) {
      const currentId = queue.pop();
      const folder = await prisma.folders.findUnique({
        where: {
          id: currentId,
          usersId: req.user.id,
        },
        include: {
          files: true,
          children: true,
        },
      });
      if (folder) {
        // delete the files and push the path for supabase delete
        folder.files.forEach((file) => {
          paths.push(file.path);
        });
        // delete the files within the children folder recursively
        folder.children.forEach((child) => {
          queue.push(child.id);
        });
      }
    }

    if (paths.length > 0) {
      await supabaseClient.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .remove(paths);
    }
    // then finally delete the folders, within the folder it has onDelete: Cascade so
    await prisma.folders.delete({
      where: { id: req.params.id },
    });

    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

const updateFilePost = async (req, res, next) => {
  if (!req.user) return res.redirect("/");
  const fileId = req.params.id;
  try {
    const file = await prisma.files.findUnique({
      where: { id: req.params.id, usersId: req.user.id },
    });
    if (!file) return res.redirect("/");

    // first update the supabase
    const newPath = file.path.replace(file.name, req.body.rename);

    const { error } = await supabaseClient.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .move(file.path, newPath);

    if (error) {
      return next(error);
    }

    const {
      data: { publicUrl },
    } = supabaseClient.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .getPublicUrl(newPath);

    // then update database (with new path)
    await prisma.files.update({
      where: {
        id: fileId,
        usersId: req.user.id,
      },
      data: {
        name: req.body.rename,
        path: newPath,
        url: publicUrl,
      },
    });
    return res.redirect("/");
  } catch (err) {
    next(err);
  }
};

const updateFolderPost = async (req, res, next) => {
  if (!req.user) return res.redirect("/");
  const folderId = req.params.id;
  try {
    // first update the database
    await prisma.folders.update({
      where: {
        id: folderId,
        usersId: req.user.id,
      },
      data: {
        name: req.body.rename,
      },
    });
    return res.redirect("/");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  newFilePost,
  deleteFileGet,
  newFolderPost,
  newNestedFolderPost,
  newNestedFilePost,
  deleteFolderGet,
  updateFolderPost,
  updateFilePost,
};
