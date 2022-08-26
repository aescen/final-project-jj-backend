const firebase = require('firebase');
const firebaseConfig = require('./fbConfig');

firebase.initializeApp(firebaseConfig);

module.exports = firebase;
