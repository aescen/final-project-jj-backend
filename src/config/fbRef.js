const firebase = require('./fbConnection');

const db = firebase.database().ref();
const storage = firebase.storage();
const storageImagesRef = storage.ref('images');
const storageFilesRef = storage.ref('files');

module.exports = {
  db,
  storage,
  storageImagesRef,
  storageFilesRef,
};
