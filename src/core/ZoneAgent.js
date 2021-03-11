const Net = require('net');
const ZoneAgentSession = require('./ZoneAgentSession');
const MSG_ZACL_CHK_TIMETICK = require('../messages/MSG_ZACL_CHK_TIMETICK');

class ZoneAgent {
  constructor(config, loginServer, zoneServers) {
    this.config = config;
    this.loginServer = loginServer;
    this.zoneServers = zoneServers;
    this.players = {};
    this.heartbeat = null;
  }

  start() {
    this.server = Net.createServer((socket) => {
      // eslint-disable-next-line no-unused-vars
      const ZAS = new ZoneAgentSession(socket, this);
    });

    this.server.listen(this.config.STARTUP.PORT, () => {
      console.log(`ZoneAgent listening on ${this.config.STARTUP.PORT}`);
    });

    this.heartbeat = setInterval(() => {
      for (var pcid in this.players) {
        if (this.players[pcid].zoneStatus !== parseInt(this.zoneAgent.config.ACCOUNTSERVER.ID, 10)) {
          this.players[pcid].tickCount++;
          this.players[pcid].tickSvr = Date.now();
          const packetMaker = new MSG_ZACL_CHK_TIMETICK(
            pcid,
            this.players[pcid].tickCount,
            this.players[pcid].tickSvr,
            0
          );
          this.players[pcid].socket.write(packetMaker.build().serialize());
        }
      }
    }, 5000);
  }

  stop() {
    console.log('Shutting down ZoneAgent...');
    clearInterval(this.heartbeat);
    for (var pcid in this.players) {
      this.players[pcid].socket.destroy();
    }

    process.exit(0);
  }
}

module.exports = ZoneAgent;
