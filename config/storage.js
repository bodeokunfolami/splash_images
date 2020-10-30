const crypto = require('crypto');
const Multer = require('multer');
const path = require('path');

function generateTokenString() {
    const token = crypto.randomBytes(32);
    let tokenString = Buffer.from(token).toString('base64');
    tokenString = tokenString.replace(/[^a-zA-Z]/g, "");
    return tokenString
}

function createUniqueFileName(file) {
    const fileExt = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExt);
    const token = generateTokenString();
    return `${fileName}-${token}${fileExt}`;
}

// DISK STORAGE
const diskStorage = Multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/assets');
    },
    filename: (req, file, callback) => {
        const filename = createUniqueFileName(file);
        callback(null, filename);
    },
});

const disk = Multer({ storage: diskStorage });

module.exports = disk;
