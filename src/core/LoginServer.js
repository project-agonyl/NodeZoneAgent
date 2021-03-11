const Net = require('net');
const { StringDecoder } = require('string_decoder');
const getPcidFromPacket = require('../helpers/getPcidFromPacket');
const MSG_ZA2LS_CONNECT = require('../messages/MSG_ZA2LS_CONNECT');
const MSG_ZA2LS_REPORT = require('../messages/MSG_ZA2LS_REPORT');

class LoginServer {
  constructor(config) {
    this.config = config;
    this.heartbeat = null;
    this.zoneAgent = null;
    this.preparedUsers = {};
    this.retryCount = 0;
  }

  initialize() {
    this.client = new Net.Socket({ allowHalfOpen: true });
    this.client.setKeepAlive(true);
    console.log('Trying to connect to LoginServer...');
    this.client.connect(this.config.LOGINSERVER.PORT, this.config.LOGINSERVER.IP);

    this.client.on('connect', () => {
      this.retryCount = 0;
      console.log(`LoginServer ${this.config.LOGINSERVER.IP}:${this.config.LOGINSERVER.PORT} connected!`);
      const initPacketMaker = new MSG_ZA2LS_CONNECT(
        this.config.STARTUP.SERVERID,
        this.config.STARTUP.AGENTID,
        this.config.STARTUP.IP,
        this.config.STARTUP.PORT
      );
      this.client.write(initPacketMaker.build().serialize());
      this.heartbeat = setInterval(() => {
        const players = this.zoneAgent ? this.zoneAgent.players : {};
        const heartbeatPacketMaker = new MSG_ZA2LS_REPORT(
          Object.keys(players).length,
          this.config.ZONESERVER.COUNT,
          this.config.ZONESERVER.COUNT
        );
        this.client.write(heartbeatPacketMaker.build().serialize());
      }, 1000);
    });

    this.client.on('data', (data) => {
      let decoder;
      switch (data[8]) {
        case 0x01:
          switch (data[9]) {
            case 0xE1:
              decoder = new StringDecoder('utf8');
              const prepareData = decoder.end(data);
              const account = prepareData.substr(10, 20).trim();
              const pcid = getPcidFromPacket(data);
              this.preparedUsers[pcid] = account;
              console.log(`Account ${account} prepared!`);
              break;
            case 0xE3:
              decoder = new StringDecoder('utf8');
              const duplicateLoginData = decoder.end(data);
              const duplicateAccount = duplicateLoginData.substr(10, 20).trim();
              console.log(`Handle duplicate login attempt for ${duplicateAccount}!`);
              break;
            default:
              console.log(`Received new packet from LoginServer with cmd ${data[9]}`);
              break;
          }
          break;
        default:
          console.log(`Received new packet from LoginServer with ctrl ${data[8]}`);
          break;
      }
    });

    this.client.on('error', () => {
      clearInterval(this.heartbeat);
      if (this.retryCount < 5) {
        console.log(`LoginServer ${this.config.LOGINSERVER.IP}:${this.config.LOGINSERVER.PORT} connection error!`);
      }
    });

    this.client.on('close', () => {
      clearInterval(this.heartbeat);
      if (this.retryCount < 5) {
        console.log(`LoginServer ${this.config.LOGINSERVER.IP}:${this.config.LOGINSERVER.PORT} connection closed!`);
      }
      setTimeout(() => {
        if (this.retryCount < 5) {
          console.log('Retrying LoginServer connection...');
        }
        this.retryCount++;
        this.client.connect(this.config.LOGINSERVER.PORT, this.config.LOGINSERVER.IP);
      }, 5000);
    });
  }
}

module.exports = LoginServer;
