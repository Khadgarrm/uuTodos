"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");

const WARNINGS = {
  unsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("todosMain");
  }

  async create(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // HDS 1  Validation of dtoIn.

    let validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.unsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // HDS 2 System checks existence and state of the todoInstance uuObject.
    const uuTodosMain = await this.mainDao.getByAwid(awid);

    if (!uuTodosMain) {
      throw new Errors.Create.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuTodosMain.state !== "active") {
      throw new Errors.Create.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: uuTodosMain.state }
      );
    }

    // HDS 3 System verifies that the inserted date is not from the past (it cannot be older than today's date).
    if (dtoIn.deadline) {
      const curDate = new Date().getTime();
      const inDate = new Date(dtoIn.deadline).getTime();

      if (curDate > inDate) {
        throw new Errors.Create.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: dtoIn.deadline });
      }
    }

    // HDS 4 System creates uuObject list in uuAppObjectStore (using list DAO create).

    const uuObject = { awid, ...dtoIn };
    let uuList = null;
    try {
      uuList = await this.listDao.create(uuObject);
    } catch (e) {
      throw new Errors.Create.ListDaoCreateFailed({ uuAppErrorMap }, e);
    }

    // HDS 5 Returns properly filled dtoOut.
    return {
      uuList,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAbl();
