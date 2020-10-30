const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    thumbnail: {
        type: String
    }
}, {
    timestamps: true
});

const Photo = mongoose.model('Photos', PhotoSchema);

module.exports = Photo;