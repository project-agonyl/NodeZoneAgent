const _ = require('lodash');
const MSG_BASE = require('./MSG_BASE');
const getReverseHexPacket = require('../helpers/getReverseHexPacket');

class MSG_HEAD_NO_PROTOCOL extends MSG_BASE {
  constructor(size, ctrl, cmd, pcid) {
    super();
    this.size = parseInt(size, 10);
    this.ctrl = parseInt(ctrl, 10);
    this.cmd = parseInt(cmd, 10);
    if (!pcid) {
      this.pcid = 0;
    } else {
      this.pcid = parseInt(pcid, 10);
    }
  }

  build() {
    this.packet = [];
    this.packet = _.concat(
      this.packet,
      getReverseHexPacket(this.size, 8),
      getReverseHexPacket(this.pcid, 8),
      this.ctrl,
      this.cmd,
    );
    return this;
  }
}

module.exports = MSG_HEAD_NO_PROTOCOL;
