const Net = require('net');
const ZoneAgentSession = require('./ZoneAgentSession');

class ZoneAgent {
  constructor(config, loginServer, zoneServers) {
    this.config = config;
    this.loginServer = loginServer;
    this.zoneServers = zoneServers;
    this.players = {};
  }

  start() {
    this.server = Net.createServer((socket) => {
      // eslint-disable-next-line no-unused-vars
      const ZAS = new ZoneAgentSession(socket, this);
    });

    this.server.listen(this.config.STARTUP.PORT, () => {
      console.log(`ZoneAgent listening on ${this.config.STARTUP.PORT}`);
    });
  }
}

module.exports = ZoneAgent;
