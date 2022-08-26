// https://stackoverflow.com/questions/62666032/how-to-createwritestream-to-gcs
// https://cloud.google.com/storage/docs/access-control/making-data-public
/* eslint-disable no-unused-vars */
const { Storage } = require('@google-cloud/storage');
const { customAlphabet, urlAlphabet } = require('nanoid');
const { storageImagesRef, storageFilesRef } = require('../../config/fbRef');
const serviceAccount = require('../../../servicesAccountKey.json');

const storage = new Storage({
  keyFilename: 'servicesAccountKey.json',
  projectId: process.env.PROJECT_ID,
});

const bucket = storage.bucket(process.env.STORAGE_BUCKET);
const nanoid = customAlphabet(urlAlphabet, 10);

module.exports = {
  uploadFile: async (fileStream, type, path = '/files') => new Promise((resolve, reject) => {
    try {
      const timestamp = Date.now();
      // const name = fileName.replace(/ /g, '_');
      const newName = `/${nanoid()}_${timestamp}.${type}`;
      const objPath = `${path}${newName}`;

      const options = {
        resumable: false,
        public: true,
      };

      const fileRef = bucket.file(objPath);
      fileStream
        .pipe(fileRef.createWriteStream(options))
        .on('finish', (r) => {
          const url = `https://storage.googleapis.com/${bucket.name}/${objPath}`;

          resolve({ name: newName, type, url });
        })
        .on('error', (e) => {
          reject(e);
        });
    } catch (error) {
      reject(error);
    }
  }),
};
