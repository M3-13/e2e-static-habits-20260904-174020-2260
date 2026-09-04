(function (global) {
  'use strict';

  var DAY_COUNT = 30;

  function findHabit(state, id) {
    if (!state || !Array.isArray(state.habits)) {
      return null;
    }
    for (var i = 0; i < state.habits.length; i++) {
      if (state.habits[i].id === id) {
        return state.habits[i];
      }
    }
    return null;
  }

  // Baut eine Spalte (Wochentag, Häkchen-Zelle, Datum) für einen Kalendertag.
  function createDayColumn(habit, checkIndex, day, state) {
    var checked = habit.checks[checkIndex] === true;

    var column = document.createElement('div');
    column.className = 'grid-day';
    column.style.display = 'flex';
    column.style.flexDirection = 'column';
    column.style.alignItems = 'center';
    column.style.gap = '2px';
    column.style.flexShrink = '0';

    var weekday = document.createElement('span');
    weekday.className = 'grid-day-weekday';
    weekday.textContent = day.weekday;
    weekday.style.fontSize = '10px';
    weekday.style.lineHeight = '1';
    weekday.style.color = 'var(--muted)';

    var cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'check-cell' + (checked ? ' checked' : '');
    cell.setAttribute('aria-pressed', checked ? 'true' : 'false');
    cell.setAttribute('aria-label', day.weekday + ', ' + day.label + (checked ? ', erledigt' : ', offen'));
    cell.title = day.weekday + ', ' + day.label;
    cell.textContent = '✓';

    var date = document.createElement('span');
    date.className = 'grid-day-date';
    date.textContent = day.label;
    date.style.fontSize = '10px';
    date.style.lineHeight = '1';
    date.style.color = 'var(--muted)';

    cell.addEventListener('click', function () {
      habit.checks[checkIndex] = !habit.checks[checkIndex];
      store.saveState(state);
      document.dispatchEvent(new CustomEvent('habits-changed'));
    });

    column.appendChild(weekday);
    column.appendChild(cell);
    column.appendChild(date);

    return column;
  }

  function renderGrid(card, habit, state) {
    var gridEl = card.querySelector('.habit-grid');
    if (!gridEl) {
      return;
    }
    gridEl.textContent = '';

    gridEl.style.display = 'flex';
    gridEl.style.flexDirection = 'row';
    gridEl.style.gap = '4px';
    gridEl.style.overflowX = 'auto';
    gridEl.style.paddingBottom = '4px';

    var days = dates.lastNDays(DAY_COUNT);
    for (var p = 0; p < days.length; p++) {
      var checkIndex = days.length - 1 - p;
      gridEl.appendChild(createDayColumn(habit, checkIndex, days[p], state));
    }
  }

  function createStat(label, value) {
    var stat = document.createElement('div');
    stat.className = 'stat';

    var labelEl = document.createElement('span');
    labelEl.className = 'stat-label';
    labelEl.textContent = label;

    var valueEl = document.createElement('span');
    valueEl.className = 'stat-value';
    valueEl.textContent = value;

    stat.appendChild(labelEl);
    stat.appendChild(valueEl);
    return stat;
  }

  function renderStats(card, habit) {
    var statsEl = card.querySelector('.habit-stats');
    if (!statsEl) {
      return;
    }
    statsEl.textContent = '';

    var current = stats.currentStreak(habit.checks);
    var longest = stats.longestStreak(habit.checks);
    var rate = stats.weekRate(habit.checks);

    statsEl.appendChild(createStat('Aktuelle Serie', current + ' Tag' + (current === 1 ? '' : 'e')));
    statsEl.appendChild(createStat('Längste Serie', longest + ' Tag' + (longest === 1 ? '' : 'e')));
    statsEl.appendChild(createStat('Wochenquote', rate === null ? '–' : rate + ' %'));
  }

  function renderAll(state) {
    var cards = document.querySelectorAll('[data-habit-id]');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var id = card.getAttribute('data-habit-id');
      var habit = findHabit(state, id);
      if (!habit) {
        continue;
      }
      renderGrid(card, habit, state);
      renderStats(card, habit);
    }
  }

  global.grid = {
    renderAll: renderAll
  };
})(globalThis);
