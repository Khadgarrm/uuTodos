"use strict";

const TodosMainUseCaseError = require("./todos-main-use-case-error.js");
const ITEM_ERROR_PREFIX = `${TodosMainUseCaseError.ERROR_PREFIX}item/`;

const Create = {
  UC_CODE: `${ITEM_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TodoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },

  TodoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },

  ListDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },

  ItemDaoCreateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemDaoCreateFailed`;
      this.message = "Creating item by item DAO create failed.";
    }
  },
};

const Get = {
  UC_CODE: `${ITEM_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TodoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },

  TodoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },

  ItemDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },
};

const Update = {
  UC_CODE: `${ITEM_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TodoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },

  TodoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },

  ItemDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },

  ItemIsNotInCorrectState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemIsNotInCorrectState`;
      this.message = "Item is not in correct state.	";
    }
  },

  ListDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },

  ItemDaoUpdateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}itemDaoUpdateFailed	`;
      this.message = "Update item by item DAO update failed.	";
    }
  },
};

const SetFinalState = {
  UC_CODE: `${ITEM_ERROR_PREFIX}setFinalState/`,
  
  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TodoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },

  TodoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },

  ItemDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },

  ItemIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}itemIsNotInProperState`;
      this.message = "Item is not in proper state.";
    }
  },
}

const Delete = {
  UC_CODE: `${ITEM_ERROR_PREFIX}delte/`,

  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TodoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },

  TodoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },

  ItemDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },

  ItemIsNotInCorectState	: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemIsNotInCorectState`;
      this.message = "Only active or cancelled items can be deleted.";
    }
  },

  ItemIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}itemIsNotInProperState`;
      this.message = "Item is not in proper state.";
    }
  },
}

const List = {
  UC_CODE: `${ITEM_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TodoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },

  TodoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },
}
module.exports = {
  Create,
  Get,
  Update,
  SetFinalState,
  Delete,
  List
};
