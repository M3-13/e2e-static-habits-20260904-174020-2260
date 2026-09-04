(function (global) {
  'use strict';

  var BAR_COUNT = 8;

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function toISO(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function parseISO(iso) {
    var parts = String(iso).split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  // Map ISO date -> check value for the last 30 days.
  // checks[i] is "i days ago"; dates.lastNDays(30)[k] is "(29 - k) days ago".
  function buildCheckMap(checks) {
    var map = {};
    if (!Array.isArray(checks)) {
      return map;
    }
    var days = global.dates.lastNDays(30);
    for (var j = 0; j < 30; j++) {
      var idx = 29 - j;
      if (idx >= 0 && idx < days.length) {
        map[days[idx].iso] = checks[j] === true;
      }
    }
    return map;
  }

  // Fulfilment rate (0..100) per calendar week of the last eight weeks.
  // Only already-elapsed days with check data count; weeks without elapsed
  // days or without any checked days yield 0.
  function weekRates(checks) {
    var map = buildCheckMap(checks);
    var weeks = global.dates.lastEightWeeks();
    var todayISO = global.dates.lastNDays(1)[0].iso;
    var has = Object.prototype.hasOwnProperty;
    var rates = [];
    for (var w = 0; w < weeks.length; w++) {
      var start = parseISO(weeks[w].startISO);
      var end = parseISO(weeks[w].endISO);
      var checked = 0;
      var elapsed = 0;
      var d = new Date(start.getTime());
      while (d.getTime() <= end.getTime()) {
        var iso = toISO(d);
        if (iso <= todayISO && has.call(map, iso)) {
          elapsed++;
          if (map[iso]) {
            checked++;
          }
        }
        d.setDate(d.getDate() + 1);
      }
      rates.push(elapsed > 0 ? Math.round(100 * checked / elapsed) : 0);
    }
    return rates;
  }

  function findHabit(habits, id) {
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].id === id) {
        return habits[i];
      }
    }
    return null;
  }

  function readColor(root, name, darkName, fallback) {
    var value = root.getPropertyValue(darkName).trim();
    if (!value) {
      value = root.getPropertyValue(name).trim();
    }
    return value || fallback;
  }

  function drawCanvas(canvas, rates, darkMode) {
    var root = global.getComputedStyle(global.document.documentElement);
    var accent = darkMode
      ? readColor(root, '--color-accent_dark', '--color-accent_dark', '#34D399')
      : readColor(root, '--color-accent', '--color-accent', '#1B8A4B');
    var muted = darkMode
      ? readColor(root, '--color-muted_dark', '--color-muted_dark', '#8A94A6')
      : readColor(root, '--color-muted', '--color-muted', '#6B7280');
    var text = darkMode
      ? readColor(root, '--color-fg_dark', '--color-fg_dark', '#E7EAF0')
      : readColor(root, '--color-fg', '--color-fg', '#1A1F2E');
    var border = darkMode
      ? readColor(root, '--color-border_dark', '--color-border_dark', '#2A2F3A')
      : readColor(root, '--color-border', '--color-border', '#E3E5E1');
    var fontFamily = root.getPropertyValue('--font-family').trim() || 'sans-serif';

    var dpr = global.devicePixelRatio || 1;
    var cssWidth = canvas.clientWidth || canvas.width || 300;
    var cssHeight = canvas.clientHeight || canvas.height || 160;

    var targetWidth = Math.round(cssWidth * dpr);
    var targetHeight = Math.round(cssHeight * dpr);
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    var ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    var padLeft = 4;
    var padRight = 4;
    var padTop = 20;
    var padBottom = 22;
    var plotWidth = cssWidth - padLeft - padRight;
    var plotHeight = cssHeight - padTop - padBottom;
    var baseline = padTop + plotHeight;
    var maxRate = 100;
    var slotWidth = plotWidth / BAR_COUNT;
    var barWidth = slotWidth * 0.6;
    if (barWidth > 48) {
      barWidth = 48;
    }
    if (barWidth < 6) {
      barWidth = 6;
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = border;
    ctx.beginPath();
    ctx.moveTo(padLeft, baseline + 0.5);
    ctx.lineTo(cssWidth - padRight, baseline + 0.5);
    ctx.stroke();

    var weeks = global.dates.lastEightWeeks();

    for (var i = 0; i < BAR_COUNT; i++) {
      var rate = rates[i] !== undefined ? rates[i] : 0;
      var centerX = padLeft + slotWidth * i + slotWidth / 2;
      var barHeight = (rate / maxRate) * plotHeight;
      var barTop = baseline - barHeight;

      if (barHeight > 0) {
        ctx.fillStyle = accent;
        ctx.fillRect(centerX - barWidth / 2, barTop, barWidth, barHeight);
      }

      ctx.fillStyle = text;
      ctx.font = '10px ' + fontFamily;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(rate) + '%', centerX, barTop - 2);

      ctx.fillStyle = muted;
      ctx.font = '10px ' + fontFamily;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      var label = weeks[i] ? weeks[i].label : '';
      ctx.fillText(label, centerX, baseline + 4);
    }
  }

  global.chart = {
    renderAll: function (state) {
      var habits = (state && Array.isArray(state.habits)) ? state.habits : [];
      var darkMode = !!(state && state.darkMode);
      var canvases = global.document.querySelectorAll('canvas.habit-chart');
      for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var card = canvas.closest('[data-habit-id]');
        if (!card) {
          continue;
        }
        var habit = findHabit(habits, card.getAttribute('data-habit-id'));
        if (!habit) {
          continue;
        }
        drawCanvas(canvas, weekRates(habit.checks), darkMode);
      }
    }
  };
})(globalThis);
