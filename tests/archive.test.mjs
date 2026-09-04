import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInThisContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const jsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'js');

let savedPayload = null;
const firedEvents = [];

function resetMocks() {
  savedPayload = null;
  firedEvents.length = 0;
  globalThis.localStorage = {
    getItem: () => null,
    setItem: (_key, value) => {
      savedPayload = JSON.parse(value);
    }
  };
  globalThis.document = {
    dispatchEvent: (e) => {
      firedEvents.push(e.type);
    }
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type) {
      this.type = type;
    }
  };
}

function load(name) {
  const code = readFileSync(path.join(jsDir, name), 'utf8');
  runInThisContext(code, { filename: name });
}

function freshHabit(id, name) {
  return { id, name, checks: Array(30).fill(false), archived: false };
}

// --- Load the modules once (stateful IIFEs attach to globalThis) ----------
resetMocks();
load('store.js');
load('habits.js');

// ---------------------------------------------------------------------------
// toggleArchived (js/habits.js) — the mutation behind AC-07
// ---------------------------------------------------------------------------

test('toggleArchived archiviert eine Gewohnheit, speichert und feuert habits-changed', () => {
  resetMocks();
  const state = { habits: [freshHabit('a', 'Lesen')], darkMode: false };

  globalThis.habits.toggleArchived(state, 'a');

  assert.equal(state.habits[0].archived, true);
  assert.ok(savedPayload, 'state must be persisted via store.saveState');
  assert.equal(savedPayload.habits[0].archived, true);
  assert.ok(firedEvents.includes('habits-changed'), 'must dispatch habits-changed');
});

test('toggleArchived stellt eine archivierte Gewohnheit wieder her', () => {
  resetMocks();
  const state = {
    habits: [{ id: 'b', name: 'Laufen', checks: Array(30).fill(false), archived: true }],
    darkMode: false
  };

  globalThis.habits.toggleArchived(state, 'b');

  assert.equal(state.habits[0].archived, false);
  assert.equal(savedPayload.habits[0].archived, false);
  assert.ok(firedEvents.includes('habits-changed'));
});

test('toggleArchived ignoriert eine unbekannte id', () => {
  resetMocks();
  const state = { habits: [freshHabit('a', 'Lesen')], darkMode: false };

  globalThis.habits.toggleArchived(state, 'nope');

  assert.equal(state.habits[0].archived, false);
  assert.equal(savedPayload, null);
  assert.equal(firedEvents.length, 0);
});

// ---------------------------------------------------------------------------
// applyFilter (js/archive.js) — the filtering + wiring behind AC-07
// ---------------------------------------------------------------------------

function makeButton() {
  const handlers = {};
  return {
    _archiveWired: false,
    addEventListener(type, fn) {
      (handlers[type] = handlers[type] || []).push(fn);
    },
    click() {
      (handlers['click'] || []).forEach((fn) => fn());
    }
  };
}

function makeCard(id, archived) {
  const archiveBtn = makeButton();
  return {
    style: {},
    archiveBtn,
    getAttribute(name) {
      if (name === 'data-habit-id') return id;
      if (name === 'data-archived') return String(archived);
      return null;
    },
    querySelector(sel) {
      return sel === '[data-action="archive"]' ? archiveBtn : null;
    }
  };
}

function makeToggle() {
  const handlers = {};
  const attrs = {};
  return {
    attrs,
    addEventListener(type, fn) {
      (handlers[type] = handlers[type] || []).push(fn);
    },
    setAttribute(name, value) {
      attrs[name] = value;
    },
    click() {
      (handlers['click'] || []).forEach((fn) => fn());
    }
  };
}

function installArchiveDom(cards, toggle) {
  globalThis.document = {
    dispatchEvent: (e) => {
      firedEvents.push(e.type);
    },
    getElementById(id) {
      return id === 'filter-toggle' ? toggle : null;
    },
    querySelectorAll(sel) {
      return sel === '.habit-card' ? cards : [];
    }
  };
}

test('applyFilter blendet archivierte Karten in der aktiven Ansicht aus', () => {
  resetMocks();
  load('archive.js'); // fresh module state (showArchived = false)
  const state = {
    habits: [
      { id: 'a', name: 'Lesen', checks: Array(30).fill(false), archived: true },
      { id: 'b', name: 'Laufen', checks: Array(30).fill(false), archived: false }
    ],
    darkMode: false
  };
  const archivedCard = makeCard('a', true);
  const activeCard = makeCard('b', false);
  installArchiveDom([archivedCard, activeCard], makeToggle());

  globalThis.archive.applyFilter(state);

  assert.equal(archivedCard.style.display, 'none');
  assert.equal(activeCard.style.display, '');
});

test('applyFilter zeigt archivierte Karten nach Umschalten des Filters', () => {
  resetMocks();
  load('archive.js');
  const state = {
    habits: [
      { id: 'a', name: 'Lesen', checks: Array(30).fill(false), archived: true },
      { id: 'b', name: 'Laufen', checks: Array(30).fill(false), archived: false }
    ],
    darkMode: false
  };
  const archivedCard = makeCard('a', true);
  const activeCard = makeCard('b', false);
  const toggle = makeToggle();
  installArchiveDom([archivedCard, activeCard], toggle);

  globalThis.archive.applyFilter(state);
  toggle.click(); // switch to archive view -> applyFilter re-runs

  assert.equal(archivedCard.style.display, '');
  assert.equal(activeCard.style.display, 'none');
  assert.equal(toggle.attrs['aria-pressed'], 'true');
});

test('Klick auf den Archivieren-Button verdrahtet toggleArchived', () => {
  resetMocks();
  load('archive.js');
  const state = { habits: [freshHabit('a', 'Lesen')], darkMode: false };
  const card = makeCard('a', false);
  installArchiveDom([card], makeToggle());

  globalThis.archive.applyFilter(state);
  assert.equal(state.habits[0].archived, false);

  card.archiveBtn.click();

  assert.equal(state.habits[0].archived, true);
  assert.ok(savedPayload, 'archive click must persist state');
  assert.equal(savedPayload.habits[0].archived, true);
  assert.ok(firedEvents.includes('habits-changed'));
});
