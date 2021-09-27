function getStringFromByteArray(data, start, length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    if (!(data[i + start] > 47 && data[i + start] < 58) && // numeric (0-9)
        !(data[i + start] > 64 && data[i + start] < 91) && // upper alpha (A-Z)
        !(data[i + start] > 96 && data[i + start] < 123)) { // lower alpha (a-z)
      break;
    }

    result += String.fromCharCode(data[i + start]);
  }

  return result;
}

module.exports = getStringFromByteArray;
