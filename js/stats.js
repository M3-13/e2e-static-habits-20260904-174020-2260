(function (global) {
  'use strict';

  // checks[0] = heute, checks[i] = vor i Tagen (i = 0..29).
  // Alle Funktionen sind rein: sie lesen nur das übergebene Array.

  function currentStreak(checks) {
    if (!Array.isArray(checks)) {
      return 0;
    }
    var streak = 0;
    for (var i = 0; i < checks.length; i++) {
      if (checks[i] === true) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  }

  function longestStreak(checks) {
    if (!Array.isArray(checks)) {
      return 0;
    }
    var longest = 0;
    var current = 0;
    for (var i = 0; i < checks.length; i++) {
      if (checks[i] === true) {
        current += 1;
        if (current > longest) {
          longest = current;
        }
      } else {
        current = 0;
      }
    }
    return longest;
  }

  // Wochenquote in Prozent (0–100). Woche beginnt Montag, es zählen nur die
  // bereits vergangenen Tage der laufenden Woche (inkl. heute). Liefert null,
  // wenn sich keine vergangenen Tage ermitteln lassen.
  function weekRate(checks) {
    if (!Array.isArray(checks)) {
      return null;
    }
    var elapsed = dates.weekElapsedDays();
    if (typeof elapsed !== 'number' || elapsed <= 0) {
      return null;
    }
    var count = 0;
    var limit = Math.min(elapsed, checks.length);
    for (var i = 0; i < limit; i++) {
      if (checks[i] === true) {
        count += 1;
      }
    }
    return Math.round((count / elapsed) * 100);
  }

  global.stats = {
    currentStreak: currentStreak,
    longestStreak: longestStreak,
    weekRate: weekRate
  };
})(globalThis);
