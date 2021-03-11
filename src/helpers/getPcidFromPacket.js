const _ = require('lodash');
const getIntFromReverseHex = require('./getIntFromReverseHex');

function getPcidFromPacket(data) {
  if (!_.isArray(data) || data.length < 8) {
    return 0;
  }

  return getIntFromReverseHex(_.chunk(data, 4)[1]);
}

module.exports = getPcidFromPacket;
