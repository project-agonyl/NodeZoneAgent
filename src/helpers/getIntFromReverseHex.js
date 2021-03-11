function getIntFromReverseHex(data) {
  var hexString = '';
  for (var i = data.length - 1; i >= 0; i--) {
    var temp = data[i].toString(16);
    if (temp.length !== 2) {
      temp = '0' + temp;
    }

    hexString += temp;
  }

  return parseInt(hexString, 16);
}

module.exports = getIntFromReverseHex;
