const _ = require('lodash');
const MSG_BASE = require('./MSG_BASE');
const MSG_HEAD_NO_PROTOCOL = require('./MSG_HEAD_NO_PROTOCOL');
const getReverseHexPacket = require('../helpers/getReverseHexPacket');

class MSG_ZACL_CHK_TIMETICK extends MSG_BASE {
  constructor(pcid, tickCount, tickSvr, tickClt) {
    super();
    this.pcid = parseInt(pcid, 10);
    this.tickCount = parseInt(tickCount, 10);
    this.tickSvr = parseInt(tickSvr, 10);
    this.tickClt = parseInt(tickClt, 10);
    this.size = 22;
  }

  build() {
    const header = new MSG_HEAD_NO_PROTOCOL(this.size, 0x01, 0xF0, this.pcid);
    this.packet = header.build().getPacket();
    this.packet = _.concat(
      this.packet,
      this.reason,
      getReverseHexPacket(this.tickCount, 8),
      getReverseHexPacket(this.tickSvr, 8),
      getReverseHexPacket(this.tickClt, 8)
    );
    return this;
  }
}

module.exports = MSG_ZACL_CHK_TIMETICK;
