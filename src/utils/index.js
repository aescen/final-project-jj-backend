const TokenManager = require('./tokenmanager');
const BCryptPassword = require('./bcryptpassword');
const GCStorage = require('./gcstorage');

const flatDeep = (arr, d = 1) => (d > 0
  ? arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val),
    [],
  )
  : arr.slice());

module.exports = {
  TokenManager,
  BCryptPassword,
  GCStorage,
  flatDeep,
};
