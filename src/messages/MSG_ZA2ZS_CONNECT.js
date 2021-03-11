const _ = require('lodash');
const MSG_BASE = require('./MSG_BASE');

class MSG_ZA2ZS_CONNECT extends MSG_BASE {
  constructor(agentId) {
    super();
    this.agentId = parseInt(agentId, 10);
    this.size = 11;
  }

  build() {
    this.packet = [];
    this.packet = _.concat(this.packet, this.agentId);
    return this;
  }
}

module.exports = MSG_ZA2ZS_CONNECT;
