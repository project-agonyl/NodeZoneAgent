const _ = require('lodash');
const getDataLengthFromPacket = require('../helpers/getDataLengthFromPacket');
const getIntFromReverseHex = require('../helpers/getIntFromReverseHex');
const getPcidFromPacket = require('../helpers/getPcidFromPacket');
const MSG_ZA2LS_PREPARED_ACC_LOGIN = require('../messages/MSG_ZA2LS_PREPARED_ACC_LOGIN');
const MSG_ZA2AS_NEW_CLIENT = require('../messages/MSG_ZA2AS_NEW_CLIENT');
const MSG_ZA2ZS_ACC_LOGOUT = require('../messages/MSG_ZA2ZS_ACC_LOGOUT');
const MSG_ZA2LS_ACC_LOGOUT = require('../messages/MSG_ZA2LS_ACC_LOGOUT');
const insertPcidIntoData = require('../helpers/insertPcidIntoData');

class ZoneAgentSession {
  constructor(socket, zoneAgent) {
    this.socket = socket;
    this.zoneAgent = zoneAgent;
    this.id = null;
    this.account = null;
    this.town = null;
    this.character = null;
    this.ipAddress = null;
    this.logoutReason = 1; // 0:logout, 1:connection lost, 2:duplicate login, 3:?, 4:speed hack
    this.zoneStatus = parseInt(this.zoneAgent.config.ACCOUNTSERVER.ID, 10);
    this.tickCount = 0;
    this.tickSvr = 0;
    this.tickSvrPre = 0;
    this.tickCltPre = 0;
    this.tickCountPre = 0;
    this.tickErrCount = 0;
    this.tickCltUnique = 0;

    this.socket.on('data', (buffer) => {
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

    this.socket.on('close', () => {
      console.log(`${this.socket.remoteAddress}:${this.socket.remotePort} closed connection`);
      if (this.id) {
        if (this.logoutReason !== 0) {
          const zsLogoutPacketMaker = new MSG_ZA2ZS_ACC_LOGOUT(this.id, this.logoutReason);
          this.zoneAgent.zoneServers.ZS[this.getMyZoneStatus()]
            .client.write(zsLogoutPacketMaker.build().serialize());
        }

        if (this.logoutReason !== 2) {
          const lsLogoutPacketMaker = new MSG_ZA2LS_ACC_LOGOUT(this.id, this.logoutReason, this.account);
          this.zoneAgent.loginServer.client.write(lsLogoutPacketMaker.build().serialize());
        }

        if (this.zoneAgent.players[this.id]) {
          delete this.zoneAgent.players[this.id];
        }
      }
    });

    this.socket.on('error', (error) => {
      console.error(`${this.socket.remoteAddress}:${this.socket.remotePort} connection Error ${error}`);
    });
  }

  processPacket(data) {
    if (data[8] === 0x01 && data[9] === 0xE2) {
      const pcid = getIntFromReverseHex(_.slice(data, 10, 14));
      if (pcid === getPcidFromPacket(data) && _.has(this.zoneAgent.loginServer.preparedUsers, pcid)) {
        this.id = pcid;
        this.account = this.zoneAgent.loginServer.preparedUsers[pcid];
        this.ipAddress = this.socket.remoteAddress;
        this.zoneAgent.players[pcid] = this;
        delete this.zoneAgent.loginServer.preparedUsers[pcid];
        const lsPreparedPacketMaker = new MSG_ZA2LS_PREPARED_ACC_LOGIN(this.id, this.account);
        this.zoneAgent.loginServer.client.write(lsPreparedPacketMaker.build().serialize());
        const asPacketMaker = new MSG_ZA2AS_NEW_CLIENT(pcid, this.account, this.ipAddress);
        this.zoneAgent.zoneServers.ZS[parseInt(this.zoneAgent.config.ACCOUNTSERVER.ID, 10)]
          .client.write(asPacketMaker.build().serialize());
        console.log(`Account ${this.account} has joined!`);
      } else {
        this.socket.destroy();
      }

      return;
    }

    if (!this.id || !this.zoneAgent.players[this.id]) {
      console.log('Got packet to process from socket without PCID');
      this.socket.destroy();
      return;
    }

    data = insertPcidIntoData(data, this.id);
    switch (data[8]) {
      case 0x01:
        switch (data[9]) {
          case 0xF0:
            console.log('Time-tick packet');
            break;
          default:
            console.log(`CL->ZA unknown command ${data[9]}`);
            break;
        }

        break;
      case 0x03:
        switch (data[11]) {
          case 0x11:
            switch (data[10]) {
              case 0x06: // Login
                this.zoneAgent.zoneServers.ZS[parseInt(this.zoneAgent.config.ACCOUNTSERVER.ID, 10)]
                  .client.write(Buffer.from(data));
                break;
              case 0x08: // Logout
                this.logoutReason = 0;
                this.zoneAgent.zoneServers.ZS[this.getMyZoneStatus()]
                  .client.write(Buffer.from(data));
                break;
              default:
                this.zoneAgent.zoneServers.ZS[this.getMyZoneStatus()]
                  .client.write(Buffer.from(data));
                break;
            }

            break;
          case 0xA0:
            switch (data[10]) {
              case 0x01: // Create character
              case 0x02: // Delete character
                this.zoneAgent.zoneServers.ZS[parseInt(this.zoneAgent.config.ACCOUNTSERVER.ID, 10)]
                  .client.write(Buffer.from(data));
                break;
              default:
                this.zoneAgent.zoneServers.ZS[this.getMyZoneStatus()]
                  .client.write(Buffer.from(data));
                break;
            }

            break;
          case 0x23:
            switch (data[10]) {
              case 0x22: // Change KH logo
              case 0x23: // Get KH logo
                this.zoneAgent.zoneServers.ZS[parseInt(this.zoneAgent.config.ACCOUNTSERVER.ID, 10)]
                  .client.write(Buffer.from(data));
                break;
              default:
                this.zoneAgent.zoneServers.ZS[this.getMyZoneStatus()]
                  .client.write(Buffer.from(data));
                break;
            }

            break;
          default:
            this.zoneAgent.zoneServers.ZS[this.getMyZoneStatus()]
              .client.write(Buffer.from(data));
            break;
        }

        break;
      default:
        switch (data[11]) {
          case 0x23:
            switch (data[10]) {
              case 0x22: // Change KH logo
              case 0x23: // Get KH logo
                this.zoneAgent.zoneServers.ZS[parseInt(this.zoneAgent.config.ACCOUNTSERVER.ID, 10)]
                  .client.write(Buffer.from(data));
                break;
            }

            break;
        }

        break;
    }
  }

  getMyZoneStatus() {
    return parseInt(this.zoneStatus, 10);
  }
}

module.exports = ZoneAgentSession;
