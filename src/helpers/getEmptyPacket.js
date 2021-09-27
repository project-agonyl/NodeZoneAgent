function getEmptyPacket(length) {
  const packet = [];
  for (let i = 0; i < length; i++) {
    packet.push(0x00);
  }

  return packet;
}

module.exports = getEmptyPacket;
