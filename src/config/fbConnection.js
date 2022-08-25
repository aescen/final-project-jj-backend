const firebase = require('firebase');

const firebaseConfig = {
  apiKey: 'AIzaSyAvQ8KY07nme5UCkZOaUEnyE01diqsZsos',
  authDomain: 'fp-jj-fwdb.firebaseapp.com',
  projectId: 'fp-jj-fwdb',
  storageBucket: 'fp-jj-fwdb.appspot.com',
  messagingSenderId: '968787712277',
  appId: '1:968787712277:web:2f5813de108dd656fa711c',
};

firebase.initializeApp(firebaseConfig);

const dbRef = firebase.database().ref();

const storage = firebase.storage();
const storageImagesRef = storage.ref('images');
const storageFilesRef = storage.ref('files');

module.exports = {
  firebase,
  storage,
  dbRef,
  storageImagesRef,
  storageFilesRef,
};
