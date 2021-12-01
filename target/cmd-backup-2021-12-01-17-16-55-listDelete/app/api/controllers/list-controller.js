"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {

  update(ucEnv) {
    return ListAbl.update(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  get(ucEnv) {
    return ListAbl.get(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new ListController();
