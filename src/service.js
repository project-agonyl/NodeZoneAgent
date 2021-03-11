/**
 * Entry point
 */
const config = require('./config');
const LoginServer = require('./core/LoginServer');
const ZoneServers = require('./core/ZoneServers');
const ZoneAgent = require('./core/ZoneAgent');

Buffer.prototype.toByteArray = function () {
  return Array.prototype.slice.call(this, 0)
};

const loginServer = new LoginServer(config);
const zoneServers = new ZoneServers(config);
const zoneAgent = new ZoneAgent(config, loginServer, zoneServers);
loginServer.zoneAgent = zoneAgent;
loginServer.initialize();
zoneServers.zoneAgent = zoneAgent;
zoneServers.initialize();
zoneAgent.start();

if (process.platform === 'win32') {
  var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}

process.on('SIGINT', () => {
  zoneAgent.stop();
});
