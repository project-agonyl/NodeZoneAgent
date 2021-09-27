function getReverseHexPacket(number, length) {
  number = parseInt(number, 10);
  const reverseHexPacket = [];
  let hexString = number.toString(16);
  while (hexString.length < length) {
    hexString = '0' + hexString;
  }

  for (let i = length - 2; i >= 0; i = i - 2) {
    reverseHexPacket.push(parseInt(hexString.substr(i, 2), 16));
  }

  return reverseHexPacket;
}

module.exports = getReverseHexPacket;
