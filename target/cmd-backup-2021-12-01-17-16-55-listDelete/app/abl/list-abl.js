"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("todosMain");
  }

  //Update
  async update(uri, dtoIn, uuAppErrorMap = {}) {
    //HDS 1 Validation of dtoIn.

    const awid = uri.getAwid();

    let validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    //HDS 2 System checks existence and state of the todoInstance uuObject.
    let uuTodosMain = await this.mainDao.getByAwid(awid);

    if (!uuTodosMain) {
      throw new Errors.Update.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuTodosMain.state !== "active") {
      throw new Errors.Update.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: uuTodosMain.state }
      );
    }

    //HDS 3 System verifies that the inserted date is not from the past (it cannot be older than today's date).

    if (dtoIn.deadline) {
      const curDate = new Date().getTime();
      const inDate = new Date(dtoIn.deadline).getTime();

      if (curDate > inDate) {
        throw new Errors.Create.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: dtoIn.deadline });
      }
    }

    //HDS 4 Updates uuObject list (using list DAO update).

    let uuObject = { ...dtoIn, awid };

    try {
      uuObject = await this.listDao.update(uuObject);
    } catch(e) {
      throw new Errors.Update.ListDaoUpdateFailed({ uuAppErrorMap });
    }

    //HDS 5 Returns properly filled dtoOut.
    return {
      uuAppErrorMap,
      ...uuObject,
    };
  }

  //GET
  async get(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    // HDS 1 System calls the validate method for dtoIn according to dtoInType and fills validationResult with it.

    let validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    //HDS 2 System checks existence and state of the todoInstance uuObject.

    const uuTodosMain = await this.mainDao.getByAwid(awid);

    if (!uuTodosMain) {
      throw new Errors.Get.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuTodosMain.state !== "active") {
      throw new Errors.Get.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: uuTodosMain.state }
      );
    }

    //HDS 3 System gets uuObject list from uuAppObjectStore (using list DAO get with awid and dtoIn.id).

    const uuObject = await this.listDao.get(awid, dtoIn.id);
    if (!uuObject) {
      throw new Errors.Get.ListDoesNotExist({ uuAppErrorMap });
    }

    //HDS 4 Returns properly filled dtoOut.
    return {
      uuAppErrorMap,
      ...uuObject,
    };
  }

  //CREATE
  async create(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // HDS 1  Validation of dtoIn.

    let validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
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
