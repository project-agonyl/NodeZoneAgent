const _ = require('lodash');
const getIntFromReverseHex = require('./getIntFromReverseHex');

function getDataLengthFromPacket(data) {
  if (!_.isArray(data) || data.length < 4) {
    return 0;
  }

  return getIntFromReverseHex(_.chunk(data, 4)[0]);
}

module.exports = getDataLengthFromPacket;
