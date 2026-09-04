(function (global) {
  'use strict';

  var KEY = 'habit-tracker-state';
  var MAX_NAME_LENGTH = 100;
  var CHECK_COUNT = 30;

  function newId() {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
    } catch (e) {
      /* fall through to the fallback below */
    }
    return 'h-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function sanitizeHabit(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
      return null;
    }
    if (typeof raw.name !== 'string') {
      return null;
    }
    var name = raw.name.trim();
    if (name.length < 1 || name.length > MAX_NAME_LENGTH) {
      return null;
    }
    if (!Array.isArray(raw.checks) || raw.checks.length !== CHECK_COUNT) {
      return null;
    }
    for (var i = 0; i < raw.checks.length; i++) {
      if (typeof raw.checks[i] !== 'boolean') {
        return null;
      }
    }
    if (typeof raw.archived !== 'boolean') {
      return null;
    }
    var id = (typeof raw.id === 'string' && raw.id.length > 0) ? raw.id : newId();
    return {
      id: id,
      name: name,
      checks: raw.checks.slice(),
      archived: raw.archived
    };
  }

  function parseHabits(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
      return null;
    }
    if (!Array.isArray(raw.habits)) {
      return null;
    }
    var habits = [];
    for (var i = 0; i < raw.habits.length; i++) {
      var habit = sanitizeHabit(raw.habits[i]);
      if (habit === null) {
        return null;
      }
      habits.push(habit);
    }
    return habits;
  }

  function loadState() {
    var empty = { habits: [], darkMode: false };
    var raw = null;
    try {
      raw = global.localStorage.getItem(KEY);
    } catch (e) {
      return empty;
    }
    if (raw === null || raw === undefined || raw === '') {
      return empty;
    }
    var parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return empty;
    }
    var habits = parseHabits(parsed);
    if (habits === null) {
      return empty;
    }
    var darkMode = (typeof parsed.darkMode === 'boolean') ? parsed.darkMode : false;
    return { habits: habits, darkMode: darkMode };
  }

  function saveState(state) {
    var habits = (state && Array.isArray(state.habits)) ? state.habits : [];
    var payload = {
      habits: habits,
      darkMode: !!(state && state.darkMode)
    };
    global.localStorage.setItem(KEY, JSON.stringify(payload));
  }

  function exportData() {
    var state = loadState();
    return JSON.stringify({ habits: state.habits });
  }

  function importData(text) {
    var parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return { ok: false, error: 'Die Datei enthält kein gültiges JSON.' };
    }
    var habits = parseHabits(parsed);
    if (habits === null) {
      return {
        ok: false,
        error: 'Ungültige Datenstruktur: Es wird ein Objekt mit einem "habits"-Array erwartet, in dem jede Gewohnheit "name" (1-100 Zeichen), "checks" (30 Booleans) und "archived" (Boolean) besitzt.'
      };
    }
    return { ok: true, habits: habits };
  }

  global.store = {
    loadState: loadState,
    saveState: saveState,
    exportData: exportData,
    importData: importData,
    newId: newId
  };
})(globalThis);
