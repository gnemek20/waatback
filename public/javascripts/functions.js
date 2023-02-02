const existsdir = (address) => {
  const fs = require('fs');
  const replaceAddress = address.replace(/\//g, '\\');

  const isExist = fs.existsSync(`${process.cwd()}${replaceAddress}`);
  return isExist;
}

const mkdir = (address) => {
  const fs = require('fs');
  const replaceAddress = address.replace(/\//g, '\\');

  fs.mkdirSync(`${process.cwd()}${replaceAddress}`, {recursive: true});
}

const rmdir = (address) => {
  const fs = require('fs');
  const replaceAddress = address.replace(/\//g, '\\');

  fs.rm(`${process.cwd()}${replaceAddress}`, {recursive: true});
}

module.exports.existsdir = (address) => existsdir(address)
module.exports.mkdir = (address) => mkdir(address)
module.exports.rmdir = (address) => rmdir(address)