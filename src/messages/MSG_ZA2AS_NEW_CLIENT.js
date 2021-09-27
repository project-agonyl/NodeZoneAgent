const _ = require('lodash');
const MSG_BASE = require('./MSG_BASE');
const MSG_HEAD_NO_PROTOCOL = require('./MSG_HEAD_NO_PROTOCOL');
const getPacketFromStringByLength = require('../helpers/getPacketFromStringByLength');
const getEmptyPacket = require('../helpers/getEmptyPacket');

class MSG_ZA2AS_NEW_CLIENT extends MSG_BASE {
  constructor(pcid, account, ipAddress) {
    super();
    this.pcid = parseInt(pcid, 10);
    this.account = account;
    this.ipAddress = ipAddress;
    this.size = 146;
  }

  build() {
    const header = new MSG_HEAD_NO_PROTOCOL(this.size, 0x01, 0xE1, this.pcid);
    this.packet = header.build().getPacket();
    this.packet = _.concat(
      this.packet,
      getPacketFromStringByLength(this.account, 21),
      getEmptyPacket(21),
      getPacketFromStringByLength(this.ipAddress, 16),
      getEmptyPacket(78),
    );
    return this;
  }
}

module.exports = MSG_ZA2AS_NEW_CLIENT;
