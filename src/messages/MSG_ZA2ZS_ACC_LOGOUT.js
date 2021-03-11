const _ = require('lodash');
const MSG_BASE = require('./MSG_BASE');
const MSG_HEAD_NO_PROTOCOL = require('./MSG_HEAD_NO_PROTOCOL');

class MSG_ZA2ZS_ACC_LOGOUT extends MSG_BASE {
  constructor(pcid, reason) {
    super();
    this.pcid = parseInt(pcid, 10);
    this.reason = parseInt(reason, 10);
    this.size = 11;
  }

  build() {
    const header = new MSG_HEAD_NO_PROTOCOL(this.size, 0x01, 0xE2, this.pcid);
    this.packet = header.build().getPacket();
    this.packet = _.concat(
      this.packet,
      this.reason
    );
    return this;
  }
}

module.exports = MSG_ZA2ZS_ACC_LOGOUT;
