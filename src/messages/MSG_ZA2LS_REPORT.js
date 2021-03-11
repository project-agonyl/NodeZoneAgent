const _ = require('lodash');
const getReverseHexPacket = require('../helpers/getReverseHexPacket');
const MSG_BASE = require('./MSG_BASE');
const MSG_HEAD_NO_PROTOCOL = require('./MSG_HEAD_NO_PROTOCOL');

class MSG_ZA2LS_REPORT extends MSG_BASE {
  constructor(playerCount, zsCount1, zsCount2) {
    super();
    this.playerCount = parseInt(playerCount, 10);
    this.zsCount1 = parseInt(zsCount1, 10);
    this.zsCount2 = parseInt(zsCount2, 10);
    this.size = 16;
  }

  build() {
    const header = new MSG_HEAD_NO_PROTOCOL(this.size, 0x02, 0xE1);
    this.packet = header.build().getPacket();
    this.packet = _.concat(
      this.packet,
      getReverseHexPacket(this.zaPort, 8),
      this.zsCount1,
      this.zsCount2
    );
    return this;
  }
}

module.exports = MSG_ZA2LS_REPORT;
