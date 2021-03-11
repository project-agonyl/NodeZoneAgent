const _ = require('lodash');
const MSG_BASE = require('./MSG_BASE');
const MSG_HEAD_NO_PROTOCOL = require('./MSG_HEAD_NO_PROTOCOL');

class MSG_ZA2ZS_CONNECT extends MSG_BASE {
  constructor(agentId) {
    super();
    this.agentId = parseInt(agentId, 10);
    this.size = 11;
  }

  build() {
    const header = new MSG_HEAD_NO_PROTOCOL(this.size, 0x01, 0xE0);
    this.packet = header.build().getPacket();
    this.packet = _.concat(this.packet, this.agentId);
    return this;
  }
}

module.exports = MSG_ZA2ZS_CONNECT;
