function getIntFromReverseHex(data) {
  let hexString = '';
  for (let i = data.length - 1; i >= 0; i--) {
    let temp = data[i].toString(16);
    if (temp.length !== 2) {
      temp = '0' + temp;
    }

    hexString += temp;
  }

  return parseInt(hexString, 16);
}

module.exports = getIntFromReverseHex;
