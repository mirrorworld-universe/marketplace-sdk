'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./mirrorworld-web3.js.cjs.prod.js");
} else {
  module.exports = require("./mirrorworld-web3.js.cjs.dev.js");
}
