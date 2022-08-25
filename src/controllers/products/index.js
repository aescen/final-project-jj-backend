const busboy = require('busboy');
// const { customAlphabet, urlAlphabet } = require('nanoid/non-secure');

// const nanoid = customAlphabet(urlAlphabet, 16);

module.exports = {
  addProduct: async (req, res) => {
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log(
        `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType,
      );
      file
        .on('data', (data) => {
          console.log(`File [${name}] got ${data.length} bytes`);
        })
        .on('close', () => {
          console.log(`File [${name}] done`);
        });
    });
    bb.on('field', (name, val) => {
      console.log(`Field [${name}]: value: %j`, val);
    });
    bb.on('close', () => {
      console.log('Done parsing form!');
      res.json('done');
    });
    req.pipe(bb);
  },
};
