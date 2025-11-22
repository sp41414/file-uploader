const prisma = require("../db/prisma");
const supabaseClient = require("../storage/supabaseClient");
const multer = require("../storage/multerConfig");

const newFilePost = async (req, res, next) => {
    multer(req, res, async (err) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!req.file) {
            // shouldn't happen since it is required, but yeah
            return res.redirect("/");
        }
        if (!req.user) {
            return res.redirect("/");
        }

        try {
            const fileBuffer = req.file.buffer;
            const uniqueFileName = `${Date.now()}_${req.file.originalname}`;

            const { data, error: uploadError } = await supabaseClient.storage
                .from(process.env.SUPABASE_BUCKET_NAME)
                .upload(uniqueFileName, fileBuffer, {
                    contentType: req.file.mimetype,
                    upsert: false,
                });

            if (uploadError) {
                return next(uploadError);
            }

            const { data: { publicUrl } } = supabaseClient.storage
                .from(process.env.SUPABASE_BUCKET_NAME)
                .getPublicUrl(data.path);

            await prisma.files.create({
                data: {
                    name: req.file.originalname,
                    size: req.file.size,
                    url: publicUrl,
                    usersId: req.user.id,
                },
            });
            res.redirect("/");
        } catch (err) {
            return next(err);
        }
    });
};

module.exports = {
    newFilePost,
};
