/* eslint-disable no-unused-vars */
const admin = require('firebase-admin');
const firebase = require('firebase');
const serviceAccount = require('../../../servicesAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.BUCKET_URI,
});

const bucket = admin.storage().bucket();

module.exports = {
  uploadFile: async () => {},
  uploadPic: async (picName, file) => {
    // await bucket('images').file(picName).save(file);

    bucket.upload(
      file.path,
      {
        destination: `pic/${picName}`,
        metadata: {
          contentType: file.mimetype,
          cacheControl: 'public, max-age=31536000',
        },
      },
      (err, uploadedFile) => {
        if (err) {
          console.log(err);
        } else {
          console.log('done');
        }
      },
    );
  },
};
