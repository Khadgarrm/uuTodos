"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");

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
  setFinalStateUnsupportedKeys: {
    code: `${Errors.SetFinalState.UC_CODE}unsupportedKeys`,
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },
};

class ItemAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item");
    this.mainDao = DaoFactory.getDao("todosMain");
  }

  async list(uri, dtoIn, session, uuAppErrorMap = {}) {
    const awid = uri.getAwid();

    // HDS 1 Validation of dtoIn.
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    if (!dtoIn.pageInfo) {
      dtoIn.pageInfo = {};
    }
    if (!dtoIn.pageInfo.pageIndex) {
      dtoIn.pageInfo.pageIndex = 0;
    }
    if (!dtoIn.pageInfo.pageSize) {
      dtoIn.pageInfo.pageSize = 1000;
    }

    // HDS 2 System checks existence and state of the todoInstance uuObject.

    const uuTodosMain = await this.mainDao.getByAwid(awid);

    if (!uuTodosMain) {
      throw new Errors.Delete.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuTodosMain.state !== "active") {
      throw new Errors.Delete.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: uuTodosMain.state }
      );
    }

    // HDS 3 System loads from uuAppObjectStore basic attributes of all uuObject items by keys given in dtoIn, and saves them to dtoOut.itemList.

    let uuObject = { ...dtoIn, awid };
    if (uuObject.listId && uuObject.state) {
      uuObject = await this.itemDao.listByListIdAndState(uuObject);
    } else if (uuObject.state) {
      uuObject = await this.itemDao.listByState(uuObject);
    } else {
      uuObject = await this.itemDao.list(uuObject);
    }

    // HDS 4 Returns properly filled dtoOut.

    return {
      ...uuObject,
    };
  }

  //DELETE
  async delete(uri, dtoIn, uuAppErrorMap = {}) {
    //HDS 1 Validation of dtoIn.
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    //HDS 2 System checks existence and state of the todoInstance uuObject.
    let uuTodosMain = await this.mainDao.getByAwid(awid);

    if (!uuTodosMain) {
      throw new Errors.Delete.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuTodosMain.state !== "active") {
      throw new Errors.Delete.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: uuTodosMain.state }
      );
    }

    //HDS 3 System verifies that the item entered in dtoIn.id exists (using item DAO get with awid and dtoIn.id) and that item state is active. The result is saved to item.
    let uuItem = await this.itemDao.get(awid, dtoIn.id);
    if (!uuItem) {
      throw new Errors.Delete.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }
    if (uuItem.state === "completed") {
      throw new Errors.Delete.ItemIsNotInCorectState(
        { uuAppErrorMap },
        { id: dtoIn.id, state: uuItem.state, expectedStateList: ["active", "cancelled"] }
      );
    }

    //HDS 4 System saves dtoIn to uuAppObjectStore (using item DAO setFinalState with awid and dtoIn). The result is saved to item.

    let uuObject = { awid, ...dtoIn };

    //HDS 5 return

    uuObject = await this.itemDao.delete(uuObject);

    return {
      ...uuObject,
      uuAppErrorMap,
    };
  }

  //SETFINALSTATE
  async setFinalState(uri, dtoIn, uuAppErrorMap = {}) {
    //HDS 1 Validation of dtoIn.
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.setFinalStateUnsupportedKeys.code,
      Errors.SetFinalState.InvalidDtoIn
    );

    //HDS 2 System checks existence and state of the todoInstance uuObject.
    const uuTodosMain = await this.mainDao.getByAwid(awid);

    if (!uuTodosMain) {
      throw new Errors.SetFinalState.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuTodosMain.state !== "active") {
      throw new Errors.SetFinalState.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: uuTodosMain.state }
      );
    }

    //HDS 3 System verifies that the item entered in dtoIn.id exists (using item DAO get with awid and dtoIn.id) and that item state is active. The result is saved to item.
    let uuItem = await this.itemDao.get(awid, dtoIn.id);
    if (!uuItem) {
      throw new Errors.SetFinalState.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }
    if (uuItem.state !== "active") {
      throw new Errors.SetFinalState.ItemIsNotInProperState(
        { uuAppErrorMap },
        { id: dtoIn.id, state: uuItem.state, expectedState: "active" }
      );
    }

    //HDS 4 System saves dtoIn to uuAppObjectStore (using item DAO setFinalState with awid and dtoIn). The result is saved to item.
    const uuObjcet = { ...uuItem, ...dtoIn, awid };

    //HDS 5 return

    return {
      ...uuObjcet,
      uuAppErrorMap,
    };
  }
  //UPDATE
  async update(uri, dtoIn, uuAppErrorMap = {}) {
    //HDS 1 Validation of dtoIn.

    const awid = uri.getAwid();

    let validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
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

    //HDS 3 Verifies, that the item exists and is in an active state (using item DAO get with awid and dtoIn.id). The result is saved as "item".

    let uuItem = await this.itemDao.get(awid, dtoIn.id);

    if (!uuItem) {
      throw new Errors.Update.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }
    if (uuItem.state !== "active") {
      throw new Errors.Update.ItemIsNotInCorrectState(
        { uuAppErrorMap },
        { id: dtoIn.id, currentState: uuItem.state, expectedState: "active" }
      );
    }

    //HDS 4 System verifies, that the list entered in dtoIn.listId exists (using list DAO get with awid and dtoIn.listId).

    const uuList = await this.listDao.get(awid, uuItem.listId);
    if (!uuList) {
      throw new Errors.Update.ListDoesNotExist({ uuAppErrorMap }, { id: dtoIn.listId });
    }

    //HDS 5 System updates uuObject item in the uuAppObjectStore.

    let uuObject = { ...dtoIn, awid };

    try {
      uuObject = await this.itemDao.update(uuObject);
    } catch (e) {
      throw new Errors.Update.ItemDaoUpdateFailed({ uuAppErrorMap });
    }

    //HDS 6 return

    return {
      ...uuObject,
      uuAppErrorMap,
    };
  }

  //GET
  async get(uri, dtoIn, uuAppErrorMap = {}) {
    //HDS 1 Validation of dtoIn.
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
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

    //HDS 3 System gets uuObject item from uuAppObjectStore (using item DAO get with awid and dtoIn.id).
    const uuObject = await this.itemDao.get(awid, dtoIn.id);
    if (!uuObject) {
      throw new Errors.Get.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    //HDS 4 Returns properly filled dtoOut.
    return {
      ...uuObject,
      uuAppErrorMap,
    };
  }

  async create(uri, dtoIn, session) {
    //HDS 1 Validation of dtoIn.

    const awid = uri.getAwid();
    // HDS 1
    let validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    //HDS 2 System checks existence and state of the todoInstance uuObject.

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

    //HDS 3 Expands dtoIn with the key "state: active".

    dtoIn.state = "active";

    //Hds 4 Verifies, that the list entered in dtoIn.listId exists (using list DAO get with awid and dtoIn.listId).
    let uuList = await this.listDao.get(awid, dtoIn.listId);
    if (!uuList) {
      throw new Errors.Create.ListDoesNotExist({ uuAppErrorMap }, { id: dtoIn.listId });
    }

    //HDS 5 System creates uuObject item in uuAppObjectStore (using item DAO create).

    let uuObject = { awid, ...dtoIn };

    try {
      uuObject = await this.itemDao.create(uuObject);
    } catch {
      throw new Errors.Create.ItemDaoCreateFailed({ uuAppErrorMap });
    }

    //HDS 6 Returns properly filled dtoOut.

    return {
      uuObject,
      uuAppErrorMap,
    };
  }
}

module.exports = new ItemAbl();
