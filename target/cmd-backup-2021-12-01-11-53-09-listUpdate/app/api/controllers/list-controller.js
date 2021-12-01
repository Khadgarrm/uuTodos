"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {
  get(ucEnv) {
    return ListAbl.get(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new ListController();
