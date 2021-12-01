"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
  }

  async create(awid, uuObject) {
    return await super.insertOne(awid, uuObject);
  }
}

module.exports = ListMongo;
