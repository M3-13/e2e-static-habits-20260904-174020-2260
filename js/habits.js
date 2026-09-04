(function (global) {
  'use strict';

  var MAX_NAME_LENGTH = 100;
  var CHECK_COUNT = 30;

  function getStore() {
    return (typeof global.store === 'object' && global.store) ? global.store : null;
  }

  function newId() {
    var store = getStore();
    if (store && typeof store.newId === 'function') {
      return store.newId();
    }
    return 'h-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function emptyChecks() {
    var checks = [];
    for (var i = 0; i < CHECK_COUNT; i++) {
      checks.push(false);
    }
    return checks;
  }

  function notify(state) {
    var store = getStore();
    if (store && typeof store.saveState === 'function') {
      store.saveState(state);
    }
    if (typeof global.document === 'object' && global.document) {
      global.document.dispatchEvent(new global.CustomEvent('habits-changed'));
    }
  }

  function validateName(state, name, excludeId) {
    var trimmed = (typeof name === 'string') ? name.trim() : '';
    if (trimmed.length === 0) {
      return 'Bitte gib einen Namen für die Gewohnheit ein.';
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      return 'Der Name darf höchstens ' + MAX_NAME_LENGTH + ' Zeichen lang sein.';
    }
    var habits = (state && Array.isArray(state.habits)) ? state.habits : [];
    var lower = trimmed.toLowerCase();
    for (var i = 0; i < habits.length; i++) {
      var habit = habits[i];
      if (excludeId !== undefined && habit.id === excludeId) {
        continue;
      }
      if (typeof habit.name === 'string' && habit.name.trim().toLowerCase() === lower) {
        return 'Es gibt bereits eine Gewohnheit mit diesem Namen.';
      }
    }
    return null;
  }

  function createHabit(state, name) {
    var error = validateName(state, name);
    if (error !== null) {
      return null;
    }
    var habit = {
      id: newId(),
      name: name.trim(),
      checks: emptyChecks(),
      archived: false
    };
    state.habits.push(habit);
    notify(state);
    return habit.id;
  }

  function renameHabit(state, id, name) {
    var error = validateName(state, name, id);
    if (error !== null) {
      return null;
    }
    var habits = state.habits;
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].id === id) {
        habits[i].name = name.trim();
        notify(state);
        return habits[i].id;
      }
    }
    return null;
  }

  function deleteHabit(state, id) {
    var habits = state.habits;
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].id === id) {
        habits.splice(i, 1);
        notify(state);
        return;
      }
    }
  }

  function toggleArchived(state, id) {
    var habits = state.habits;
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].id === id) {
        habits[i].archived = !habits[i].archived;
        notify(state);
        return;
      }
    }
  }

  global.habits = {
    createHabit: createHabit,
    renameHabit: renameHabit,
    deleteHabit: deleteHabit,
    toggleArchived: toggleArchived,
    validateName: validateName
  };
})(globalThis);
