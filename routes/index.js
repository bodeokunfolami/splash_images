const express = require('express');
const fileStorage = require('../config/storage')
const router = express.Router();

const photoController = require('../controllers').photos

router.get('/', photoController.index);

router.post('/api/upload', fileStorage.single('file'), photoController.upload);

router.get('/api/thumbnail', photoController.createThumbnail);

module.exports = router;