const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { upload } = require('../middlewares/imageUpload');

const Image = require('../models/image');
const passport = require('passport');

const gridFSBucket = new GridFSBucket(mongoose.connection, { bucketName: 'images' });

exports.image_get = asyncHandler(async (req, res) => {
  const downloadStream = gridFSBucket.openDownloadStream(
    new mongoose.Types.ObjectId(req.params.imageid)
  );

  downloadStream.on('data', (data) => {
    res.write(data);
  });
  downloadStream.on('error', () => {
    return res.status(404).json({ message: 'Image not found' });
  });
  downloadStream.on('end', () => {
    res.end();
  });
});

exports.image_post = [
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const file = req.file;

    res.json({ _id: file.id, contentType: file.contentType });
  }),
];
