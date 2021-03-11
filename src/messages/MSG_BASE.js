class MSG_BASE {
  constructor() {
    this.packet = [];
  }

  getPacket() {
    return this.packet;
  }

  serialize() {
    return Buffer.from(this.packet);
  }
}

module.exports = MSG_BASE;
