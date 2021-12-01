"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TodosMainMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, listId: 1, state: 1 });
    await super.createIndex({ awid: 1, state: 1 });
  }

  async create(awid, uuObject) {
    return await super.insertOne(awid, uuObject);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.deleteOne(filter);
  }

  async listByListIdAndState(uuObject) {
    let filter = {
      awid: uuObject.awid,
      listId: uuObject.listId,
      state: uuObject.state,
    };
    return await super.find(filter);
  }

  async listByState(uuObject) {
    let filter = {
      awid: uuObject.awid,
      state: uuObject.state,
    };
    return await super.find(filter);
  }

  async list(uuObject) {
    let filter = {
      awid: uuObject.awid,
    };
    return await super.find(filter);
  }
}

module.exports = TodosMainMongo;
