const _ = require('lodash');
const MSG_BASE = require('./MSG_BASE');
const MSG_HEAD_NO_PROTOCOL = require('./MSG_HEAD_NO_PROTOCOL');
const getPacketFromStringByLength = require('../helpers/getPacketFromStringByLength');

class MSG_ZA2LS_PREPARED_ACC_LOGIN extends MSG_BASE {
  constructor(pcid, account) {
    super();
    this.pcid = parseInt(pcid, 10);
    this.account = account;
    this.size = 31;
  }

  build() {
    const header = new MSG_HEAD_NO_PROTOCOL(this.size, 0x02, 0xE3, this.pcid);
    this.packet = header.build().getPacket();
    this.packet = _.concat(this.packet, getPacketFromStringByLength(this.account, 21));
    return this;
  }
}

module.exports = MSG_ZA2LS_PREPARED_ACC_LOGIN;
