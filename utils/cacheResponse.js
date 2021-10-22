// const { config } = require('../config');

// function cacheResponse(res, seconds) {
//   if (!config.dev) {
//     res.ser('cache-Control', `public, max-age=${seconds}`);
//   }
// }

require('dotenv').config();

function cacheResponse(res, seconds) {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV) {
    res.set('Cache-Control', `public, max-age=${seconds}`);
  }
}

module.exports = cacheResponse;
