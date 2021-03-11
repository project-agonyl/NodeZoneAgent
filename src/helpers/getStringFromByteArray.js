function getStringFromByteArray(data, start, length) {
  let result = '';
  for (i = start; i <= length; i++) {
    if (!(data[i] > 47 && data[i] < 58) && // numeric (0-9)
        !(data[i] > 64 && data[i] < 91) && // upper alpha (A-Z)
        !(data[i] > 96 && data[i] < 123)) { // lower alpha (a-z)
      break;
    }

    result += String.fromCharCode(data[i]);
  }

  return result;
}

module.exports = getStringFromByteArray;