(function (global) {
  'use strict';

  var currentState = null;
  var showArchived = false;
  var toggleWired = false;

  function getToggle() {
    return global.document.getElementById('filter-toggle');
  }

  function updateToggleVisual() {
    var toggle = getToggle();
    if (!toggle) {
      return;
    }
    toggle.setAttribute('aria-pressed', String(showArchived));
    toggle.setAttribute('aria-label', showArchived ? 'Zur aktiven Ansicht wechseln' : 'Zur Archivansicht wechseln');
  }

  function wireArchiveButton(btn, id) {
    btn.addEventListener('click', function () {
      if (global.habits && typeof global.habits.toggleArchived === 'function') {
        global.habits.toggleArchived(currentState, id);
      }
    });
  }

  function wireToggle() {
    if (toggleWired) {
      return;
    }
    var toggle = getToggle();
    if (!toggle) {
      return;
    }
    toggleWired = true;
    toggle.addEventListener('click', function () {
      showArchived = !showArchived;
      applyFilter(currentState);
    });
  }

  function applyFilter(state) {
    currentState = state || { habits: [] };

    var cards = global.document.querySelectorAll('.habit-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var id = card.getAttribute('data-habit-id');
      var isArchived = card.getAttribute('data-archived') === 'true';
      card.style.display = (showArchived ? isArchived : !isArchived) ? '' : 'none';

      var archiveBtn = card.querySelector('[data-action="archive"]');
      if (archiveBtn && !archiveBtn._archiveWired) {
        archiveBtn._archiveWired = true;
        wireArchiveButton(archiveBtn, id);
      }
    }

    wireToggle();
    updateToggleVisual();
  }

  global.archive = {
    applyFilter: applyFilter
  };
})(globalThis);
