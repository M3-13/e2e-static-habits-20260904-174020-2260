(function (global) {
  'use strict';

  var currentState = null;
  var messageEl = null;

  var ICONS = {
    rename: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>',
    archive: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path></svg>',
    delete: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path></svg>'
  };

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function getCardsContainer() {
    var list = document.getElementById('habit-list');
    if (!list) {
      return null;
    }
    var container = list.querySelector('.habit-cards');
    if (!container) {
      container = document.createElement('div');
      container.className = 'habit-cards';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '16px';
      var emptyState = document.getElementById('empty-state');
      list.insertBefore(container, emptyState ? emptyState.nextSibling : list.firstChild);
    }
    return container;
  }

  function getMessageEl() {
    if (messageEl) {
      return messageEl;
    }
    messageEl = document.createElement('p');
    messageEl.className = 'alert';
    messageEl.setAttribute('role', 'alert');
    messageEl.style.display = 'none';
    var form = document.getElementById('habit-form');
    if (form && form.parentNode) {
      form.parentNode.insertBefore(messageEl, form.nextSibling);
    }
    return messageEl;
  }

  function showMessage(text) {
    var el = getMessageEl();
    el.textContent = text;
    el.style.display = '';
  }

  function clearMessage() {
    if (messageEl) {
      messageEl.textContent = '';
      messageEl.style.display = 'none';
    }
  }

  function toggleEmptyState(isEmpty) {
    var emptyState = document.getElementById('empty-state');
    if (emptyState) {
      emptyState.style.display = isEmpty ? '' : 'none';
    }
  }

  function makeIconButton(label, svgMarkup) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'icon-btn';
    btn.setAttribute('aria-label', label);
    btn.title = label;
    btn.innerHTML = svgMarkup;
    return btn;
  }

  function confirmDelete(habitName, onConfirm) {
    var overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Gewohnheit löschen');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.background = 'rgba(16, 19, 26, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.padding = '16px';

    var panel = document.createElement('div');
    panel.className = 'card';
    panel.style.maxWidth = '420px';
    panel.style.width = '100%';
    panel.style.boxSizing = 'border-box';

    var title = document.createElement('h3');
    title.textContent = 'Gewohnheit löschen?';
    title.style.margin = '0 0 8px';
    title.style.fontSize = '18px';
    title.style.fontWeight = '600';
    title.style.color = 'var(--text)';

    var text = document.createElement('p');
    text.textContent = '„' + habitName + '“ wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.';
    text.style.margin = '0 0 16px';
    text.style.fontSize = '14px';
    text.style.color = 'var(--muted)';

    var actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'flex-end';
    actions.style.gap = '8px';

    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Abbrechen';

    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-primary';
    deleteBtn.textContent = 'Löschen';
    deleteBtn.style.background = 'var(--color-danger)';

    actions.appendChild(cancelBtn);
    actions.appendChild(deleteBtn);
    panel.appendChild(title);
    panel.appendChild(text);
    panel.appendChild(actions);
    overlay.appendChild(panel);

    function close() {
      document.removeEventListener('keydown', onKey);
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }

    function confirm() {
      close();
      onConfirm();
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        close();
      }
    }

    cancelBtn.addEventListener('click', close);
    deleteBtn.addEventListener('click', confirm);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        close();
      }
    });
    document.addEventListener('keydown', onKey);

    document.body.appendChild(overlay);
    cancelBtn.focus();
  }

  function startRename(nameEl, habit, state) {
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'input';
    input.value = habit.name;
    input.maxLength = 100;
    input.setAttribute('aria-label', 'Gewohnheit umbenennen');
    input.style.fontSize = '16px';
    input.style.fontWeight = '600';
    input.style.flex = '1';
    input.style.minWidth = '0';

    nameEl.replaceWith(input);
    input.focus();
    input.select();

    var done = false;

    function cancel() {
      if (done) {
        return;
      }
      done = true;
      input.replaceWith(nameEl);
    }

    function save(keepOnError) {
      if (done) {
        return;
      }
      var newName = input.value;
      var error = global.habits.validateName(state, newName, habit.id);
      if (error) {
        showMessage(error);
        if (keepOnError) {
          input.focus();
          return;
        }
        done = true;
        input.replaceWith(nameEl);
        return;
      }
      done = true;
      global.habits.renameHabit(state, habit.id, newName);
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        save(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    });

    input.addEventListener('blur', function () {
      save(false);
    });
  }

  function buildCard(habit, state) {
    var card = document.createElement('article');
    card.className = 'card habit-card';
    card.dataset.habitId = habit.id;
    card.dataset.archived = String(habit.archived);

    var header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.gap = '8px';

    var nameEl = document.createElement('h2');
    nameEl.className = 'habit-name';
    nameEl.textContent = habit.name;
    nameEl.style.margin = '0';
    nameEl.style.fontSize = '16px';
    nameEl.style.fontWeight = '600';
    nameEl.style.color = 'var(--text)';
    nameEl.style.overflowWrap = 'break-word';
    nameEl.style.flex = '1';
    nameEl.style.minWidth = '0';

    var actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '4px';
    actions.style.flexShrink = '0';

    var renameBtn = makeIconButton('Umbenennen', ICONS.rename);
    renameBtn.dataset.action = 'rename';
    renameBtn.dataset.habitId = habit.id;
    renameBtn.addEventListener('click', function () {
      startRename(nameEl, habit, state);
    });

    var archiveBtn = makeIconButton(habit.archived ? 'Wiederherstellen' : 'Archivieren', ICONS.archive);
    archiveBtn.dataset.action = 'archive';
    archiveBtn.dataset.habitId = habit.id;

    var deleteBtn = makeIconButton('Löschen', ICONS.delete);
    deleteBtn.dataset.action = 'delete';
    deleteBtn.dataset.habitId = habit.id;
    deleteBtn.addEventListener('click', function () {
      confirmDelete(habit.name, function () {
        global.habits.deleteHabit(state, habit.id);
      });
    });

    actions.appendChild(renameBtn);
    actions.appendChild(archiveBtn);
    actions.appendChild(deleteBtn);
    header.appendChild(nameEl);
    header.appendChild(actions);
    card.appendChild(header);
    return card;
  }

  function renderHabits(state) {
    currentState = state || { habits: [] };
    var container = getCardsContainer();
    if (!container) {
      return;
    }
    clearNode(container);

    var list = currentState.habits || [];
    for (var i = 0; i < list.length; i++) {
      container.appendChild(buildCard(list[i], currentState));
    }

    toggleEmptyState(list.length === 0);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    var input = document.getElementById('habit-name');
    if (!input || !currentState) {
      return;
    }
    var name = input.value;
    var error = global.habits.validateName(currentState, name);
    if (error) {
      showMessage(error);
      input.focus();
      return;
    }
    clearMessage();
    global.habits.createHabit(currentState, name);
    input.value = '';
    input.focus();
  }

  function init() {
    var form = document.getElementById('habit-form');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
  }

  global.ui = {
    renderHabits: renderHabits
  };

  init();
})(globalThis);
