function getEmptyPacket(length) {
  var packet = [];
  for (var i = 0; i < length; i++) {
    packet.push(0x00);
  }

  return packet;
}

module.exports = getEmptyPacket;
