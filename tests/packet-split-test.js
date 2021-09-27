const _ = require('lodash');
const getDataLengthFromPacket = require('../src/helpers/getDataLengthFromPacket');

let data = [
  0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x05, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00,
  0x0B, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
];
console.log(`Splitting packet of length ${data.length}`);
while (data.length > 4) {
  const currentLength = getDataLengthFromPacket(data);
  if (currentLength === 0) {
    break;
  }

  if (currentLength >= data.length) {
    processPacket(data);
    break;
  }

  processPacket(_.slice(data, 0, currentLength));
  data = _.slice(data, currentLength);
}

function processPacket(data) {
  console.log(`Shall process packet of length ${data.length}`);
  console.log(data);
}
