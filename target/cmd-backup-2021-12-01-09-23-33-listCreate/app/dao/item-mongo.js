"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TodosMainMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, listId: 1, state: 1 });
    await super.createIndex({ awid: 1,  state: 1 });
  }
}

module.exports = TodosMainMongo;
