const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 40000000 }, // generous 40MB (nobody's using it anyway)
}).single("file");
// yeah i was going to go for array, for multiple files, but naaah

module.exports = upload;
