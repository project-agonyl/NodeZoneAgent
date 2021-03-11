const ZoneServer = require('./ZoneServer');

class ZoneServers {
  constructor(config) {
    this.config = config;
    this.zoneAgent = null;
    this.ZS = {};
  }

  initialize() {
    this.ZS[parseInt(this.zoneAgent.config.ACCOUNTSERVER.ID, 10)] = new ZoneServer(
      parseInt(this.zoneAgent.config.STARTUP.AGENTID, 10),
      parseInt(this.zoneAgent.config.ACCOUNTSERVER.PORT, 10),
      this.zoneAgent,
      this.zoneAgent.config.ACCOUNTSERVER.IP,
      'AccountServer'
    );
    this.ZS[parseInt(this.zoneAgent.config.ACCOUNTSERVER.ID, 10)].initialize();
    this.ZS[parseInt(this.zoneAgent.config.BATTLESERVER.ID, 10)] = new ZoneServer(
      parseInt(this.zoneAgent.config.STARTUP.AGENTID, 10),
      parseInt(this.zoneAgent.config.BATTLESERVER.PORT, 10),
      this.zoneAgent,
      this.zoneAgent.config.BATTLESERVER.IP,
      'BattleServer'
    );
    this.ZS[parseInt(this.zoneAgent.config.BATTLESERVER.ID, 10)].initialize();
    const zoneCount = parseInt(this.config.ZONESERVER.COUNT, 10);
    for (let i = 0; i < zoneCount; i++) {
      this.ZS[parseInt(this.zoneAgent.config.ZONESERVER[`ID${i}`], 10)] = new ZoneServer(
        parseInt(this.zoneAgent.config.STARTUP.AGENTID, 10),
        parseInt(this.zoneAgent.config.ZONESERVER[`PORT${i}`], 10),
        this.zoneAgent,
        this.zoneAgent.config.ZONESERVER[`IP${i}`],
        'ZoneServer'
      );
      this.ZS[parseInt(this.zoneAgent.config.ZONESERVER[`ID${i}`], 10)].initialize();
    }
  }
}

module.exports = ZoneServers;
