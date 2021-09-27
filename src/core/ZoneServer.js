const Net = require('net');
const _ = require('lodash');
const MSG_ZA2ZS_CONNECT = require('../messages/MSG_ZA2ZS_CONNECT');
const getDataLengthFromPacket = require('../helpers/getDataLengthFromPacket');
const getPcidFromPacket = require('../helpers/getPcidFromPacket');
const {encrypt, decrypt} = require('../helpers/crypto');

class ZoneServer {
  constructor(id, port, zoneAgent, ipAddress, name) {
    this.id = id;
    this.port = port;
    this.zoneAgent = zoneAgent;
    if (ipAddress) {
      this.ipAddress = ipAddress;
    } else {
      this.ipAddress = '127.0.0.1';
    }

    if (name) {
      this.name = name;
    } else {
      this.name = `Server${this.id}`;
    }

    this.retryCount = 0;
  }

  initialize() {
    this.client = new Net.Socket({allowHalfOpen: true});
    this.client.setKeepAlive(true);
    console.log(`Trying to connect to ${this.name} ${this.ipAddress}:${this.port}...`);
    this.client.connect(this.port, this.ipAddress);

    this.client.on('connect', () => {
      this.retryCount = 0;
      console.log(`${this.name} ${this.ipAddress}:${this.port} connected!`);
      const initPacketMaker = new MSG_ZA2ZS_CONNECT(
        parseInt(this.zoneAgent.config.STARTUP.AGENTID, 10),
      );
      this.client.write(initPacketMaker.build().serialize());
    });

    this.client.on('data', (buffer) => {
      let data = buffer.toByteArray();
      while (data.length > 4) {
        const currentLength = getDataLengthFromPacket(data);
        if (currentLength === 0) {
          break;
        }

        if (currentLength >= data.length) {
          this.processPacket(data);
          break;
        }

        this.processPacket(_.slice(data, 0, currentLength));
        data = _.slice(data, currentLength);
      }
    });

    this.client.on('error', () => {
      if (this.retryCount < 5) {
        console.log(`${this.name} ${this.ipAddress}:${this.port} connection error!`);
      }
    });

    this.client.on('close', () => {
      if (this.retryCount < 5) {
        console.log(`${this.name} ${this.ipAddress}:${this.port} connection closed!`);
      }
      setTimeout(() => {
        if (this.retryCount < 5) {
          console.log(`Retrying ${this.name} ${this.ipAddress}:${this.port} connection...`);
        }
        this.retryCount++;
        this.client.connect(this.port, this.ipAddress);
      }, 5000);
    });
  }

  processPacket(data) {
    const pcid = getPcidFromPacket(data);
    if (_.has(this.zoneAgent.players, pcid)) {
      if (data[8] === 0x01 && data[9] === 0xE1) {
        const decryptedData = decrypt(data);
        // eslint-disable-next-line max-len
        console.log(`ZoneStatus of ${this.zoneAgent.players[pcid].account} changed from ${this.zoneAgent.players[pcid].zoneStatus} to ${decryptedData[0x0A]}`);
        this.zoneAgent.players[pcid].zoneStatus = decryptedData[0x0A];
        return;
      }

      if (data[10] === 0x07 && data[11] === 0x11) {
        // Save character name and town to ZA player list
      } else if (data[10] === 0x05 && data[11] === 0x11) {
        data = decrypt(data);
        for (let i = 32; i <= 784; i += 188) {
          data[i + 3] = data[i + 2];
          data[i + 2] = data[i + 1];
          data[i + 1] = 1;
          data[i] = 0x00;
        }

        data = encrypt(data);
      }

      this.zoneAgent.players[pcid].socket.write(Buffer.from(data));
    }
  }
}

module.exports = ZoneServer;
