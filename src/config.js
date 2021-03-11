const fs = require('fs');
const ini = require('ini');

if (!fs.existsSync('Svrinfo.ini')) {
  throw new Error('Svrinfo.ini not found!');
}

const config = ini.parse(fs.readFileSync('Svrinfo.ini', 'utf-8'));

module.exports = config;
