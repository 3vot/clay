var Log = require("./log")


function check(input) {
  return /^\w+$/i.test(input);
}

module.exports = {
  check: check
}