/* eslint-disable */
const _ = require('lodash');
const KEY_1 = 2366183;
const KEY_2 = 1432754;
const DYNAMIC_KEY = 79984829;

function encrypt(packetInput) {
  const packet = _.clone(packetInput);
  for (let i = 12; ((i + 4) | 0) <= packet.length; i = (i + 4) | 0) {
    let DynamicKey = DYNAMIC_KEY;
    for (let j = i; j < ((i + 4) | 0); j = (j + 1) | 0) {
      packet[j] = ((packet[j] ^ (DynamicKey >> 8))) & 255;
      DynamicKey = ((((((packet[j] + DynamicKey) | 0)) * KEY_1) | 0) + KEY_2) | 0;
    }
  }

  return packet;
}

function decrypt(packetInput) {
  const packet = _.clone(packetInput);
  for (let i = 12; ((i + 4) | 0) <= packet.length; i = (i + 4) | 0) {
    let DynamicKey = DYNAMIC_KEY;
    for (let j = i; j < ((i + 4) | 0); j = (j + 1) | 0) {
      const pSrc = packet[j];
      packet[j] = ((packet[j] ^ (DynamicKey >> 8))) & 255;
      DynamicKey = ((((((pSrc + DynamicKey) | 0)) * KEY_1) | 0) + KEY_2) | 0;
    }
  }

  return packet;
}

module.exports = {
  encrypt,
  decrypt,
};
