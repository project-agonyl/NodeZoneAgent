const _ = require('lodash');
const getPacketFromString = require('./getPacketFromString');
const getEmptyPacket = require('./getEmptyPacket');

function getPacketFromStringByLength(str, length) {
  let result = getPacketFromString(str);
  if (result.length < length) {
    result = _.concat(result, getEmptyPacket(length - result.length));
  }

  return result;
}

module.exports = getPacketFromStringByLength;
