const getReverseHexPacket = require('./getReverseHexPacket');

function insertPcidIntoData(data, pcid) {
  const pcidData = getReverseHexPacket(pcid, 8);
  data[4] = pcidData[0];
  data[5] = pcidData[1];
  data[6] = pcidData[2];
  data[7] = pcidData[3];
  return data;
}

module.exports = insertPcidIntoData;
