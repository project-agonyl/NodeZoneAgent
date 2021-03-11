function getPacketFromString(str) {
  var packet = [];
  for (var i = 0; i < str.length; i++) {
    packet.push(str.charAt(i).charCodeAt(0));
  }

  return packet;
}

module.exports = getPacketFromString;
