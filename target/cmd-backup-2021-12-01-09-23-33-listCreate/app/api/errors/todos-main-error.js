"use strict";
const TodosMainUseCaseError = require("./todos-main-use-case-error.js");

const Init = {
  UC_CODE: `${TodosMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  CreateAwscFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },
  TodoInstanceCreateDaoFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}todoInstanceCreateDaoFailed	`;
      this.message = "Create TodoInstance DAO create failed.	 failed.";
    }
  },
};

module.exports = {
  Init,
};
