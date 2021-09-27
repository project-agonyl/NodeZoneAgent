const _ = require('lodash');
const moment = require('moment');
const MSG_BASE = require('./MSG_BASE');
const MSG_HEAD_NO_PROTOCOL = require('./MSG_HEAD_NO_PROTOCOL');
const getPacketFromStringByLength = require('../helpers/getPacketFromStringByLength');

class MSG_ZA2LS_ACC_LOGOUT extends MSG_BASE {
  constructor(pcid, reason, account) {
    super();
    this.pcid = parseInt(pcid, 10);
    this.reason = parseInt(reason, 10);
    this.account = account;
    this.size = 48;
  }

  build() {
    const header = new MSG_HEAD_NO_PROTOCOL(this.size, 0x02, 0xE2, this.pcid);
    this.packet = header.build().getPacket();
    this.packet = _.concat(
      this.packet,
      this.reason,
      getPacketFromStringByLength(this.account, 21),
      getPacketFromStringByLength(moment().format('YYYYMMDD'), 9),
      getPacketFromStringByLength(moment().format('HHmmss'), 7),
    );
    return this;
  }
}

module.exports = MSG_ZA2LS_ACC_LOGOUT;
