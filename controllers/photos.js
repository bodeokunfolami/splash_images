const Jimp = require('jimp');
const path = require('path');
const Photo = require('../models/Photo');
module.exports = {


    async index(req, res) {
        try {
            const photos = await Photo.find().sort({ createdAt: -1 });
            return res.render('home.html', { photos });
        } catch (err) {
            console.log(err);
            return res.status(400).send('Unable to GET index');
        }

    },

    async upload(req, res, next) {
        if (!req.file) {
            const data = {
                status: 400,
                msg: 'File Upload failed'
            }
            return res.status(400).json(data);
        }

        const filename = req.file.filename;

        const photo = new Photo({ filename: filename });

        try {
            await photo.save();

            const data = {
                status: 200,
                filename: photo.filename,
                msg: `Successfully Uploaded ${photo.filename}`
            }

            return res.status(200).json(data)
        } catch (err) {
            console.log(err);
        }

    },

    async createThumbnail(req, res) {
        const ext = path.extname(req.query.filename);
        const originalname = path.basename(req.query.filename, ext);

        const filename = `${originalname}_300x300${ext}`;

        const diskLocation = path.join(process.cwd(), req.query.path)

        const image = await Jimp.read(diskLocation);
        image.cover(300, 300);


        try {
            await image.writeAsync(path.join(process.cwd(), "public/assets", filename))
            await Photo.updateOne({ filename: req.query.filename }, { $set: { thumbnail: filename } });
            return res.status(200).json({ filename: filename });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: "Unable to generate thumbnail" });
        }

    }
}