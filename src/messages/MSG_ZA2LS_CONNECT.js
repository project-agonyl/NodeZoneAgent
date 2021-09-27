const _ = require('lodash');
const MSG_BASE = require('./MSG_BASE');
const MSG_HEAD_NO_PROTOCOL = require('./MSG_HEAD_NO_PROTOCOL');
const getPacketFromStringByLength = require('../helpers/getPacketFromStringByLength');
const getReverseHexPacket = require('../helpers/getReverseHexPacket');

class MSG_ZA2LS_CONNECT extends MSG_BASE {
  constructor(serverId, agentId, zaIp, zaPort) {
    super();
    this.serverId = parseInt(serverId, 10);
    this.agentId = parseInt(agentId, 10);
    this.zaIp = zaIp;
    this.zaPort = parseInt(zaPort, 10);
    this.size = 32;
  }

  build() {
    const header = new MSG_HEAD_NO_PROTOCOL(this.size, 0x02, 0xE0);
    this.packet = header.build().getPacket();
    this.packet = _.concat(
      this.packet,
      this.serverId,
      this.agentId,
      getPacketFromStringByLength(this.zaIp, 16),
      getReverseHexPacket(this.zaPort, 8),
    );
    return this;
  }
}

module.exports = MSG_ZA2LS_CONNECT;
