(function (global) {
  'use strict';

  global.habits = {
    createHabit: function (state, name) {},
    renameHabit: function (state, id, name) {},
    deleteHabit: function (state, id) {},
    toggleArchived: function (state, id) {},
    validateName: function (state, name, excludeId) {}
  };
})(globalThis);
