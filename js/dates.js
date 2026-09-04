(function (global) {
  'use strict';

  var WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

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

  function lastNDays(n) {
    var count = (typeof n === 'number' && n > 0) ? n : 30;
    var today = new Date();
    var result = [];
    for (var i = count - 1; i >= 0; i--) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      result.push({
        iso: toISO(d),
        label: pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1),
        weekday: WEEKDAYS[(d.getDay() + 6) % 7]
      });
    }
    return result;
  }

  function weekStartMonday(iso) {
    var d = parseISO(iso);
    var day = d.getDay();
    var diff = (day === 0) ? -6 : (1 - day);
    d.setDate(d.getDate() + diff);
    return toISO(d);
  }

  function weekElapsedDays() {
    var now = new Date();
    var day = now.getDay();
    var mondayIndex = (day === 0) ? 6 : day - 1;
    return mondayIndex + 1;
  }

  function lastEightWeeks() {
    var today = new Date();
    var mondayISO = weekStartMonday(toISO(today));
    var monday = parseISO(mondayISO);
    var result = [];
    for (var i = 7; i >= 0; i--) {
      var start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - 7 * i);
      var end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      result.push({
        label: pad2(start.getDate()) + '.' + pad2(start.getMonth() + 1),
        startISO: toISO(start),
        endISO: toISO(end)
      });
    }
    return result;
  }

  global.dates = {
    lastNDays: lastNDays,
    weekStartMonday: weekStartMonday,
    weekElapsedDays: weekElapsedDays,
    lastEightWeeks: lastEightWeeks
  };
})(globalThis);
