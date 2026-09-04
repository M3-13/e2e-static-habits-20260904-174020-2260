(function (global) {
  'use strict';

  var currentState = null;
  var toggle = null;
  var wired = false;

  function apply(state) {
    currentState = state || { darkMode: false };
    document.documentElement.setAttribute('data-theme', currentState.darkMode ? 'dark' : 'light');
    if (toggle === null) {
      toggle = document.getElementById('theme-toggle');
    }
    if (toggle !== null) {
      toggle.setAttribute('aria-checked', currentState.darkMode ? 'true' : 'false');
    }
  }

  function applyTheme(state) {
    apply(state);
  }

  function onToggle() {
    if (currentState === null) {
      currentState = (typeof store !== 'undefined' && typeof store.loadState === 'function')
        ? store.loadState()
        : { habits: [], darkMode: false };
    }
    currentState.darkMode = !currentState.darkMode;
    store.saveState(currentState);
    apply(currentState);
    document.dispatchEvent(new CustomEvent('habits-changed'));
  }

  function wire() {
    if (wired) {
      return;
    }
    toggle = document.getElementById('theme-toggle');
    if (toggle === null) {
      return;
    }
    toggle.addEventListener('click', onToggle);
    wired = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  global.theme = {
    apply: apply,
    applyTheme: applyTheme
  };
})(globalThis);
