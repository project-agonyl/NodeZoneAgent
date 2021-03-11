/**
 * Entry point
 */
const config = require('./config');
const LoginServer = require('./core/LoginServer');
const ZoneServers = require('./core/ZoneServers');
const ZoneAgent = require('./core/ZoneAgent');

const loginServer = new LoginServer(config);
const zoneServers = new ZoneServers(config);
const zoneAgent = new ZoneAgent(config, loginServer, zoneServers);
loginServer.zoneAgent = zoneAgent;
loginServer.initialize();
zoneServers.zoneAgent = zoneAgent;
zoneServers.initialize();
zoneAgent.start();
