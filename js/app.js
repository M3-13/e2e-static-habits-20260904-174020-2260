(function () {
  'use strict';

  var state = store.loadState();

  function renderAll() {
    ui.renderHabits(state);
    grid.renderAll(state);
    chart.renderAll(state);
    archive.applyFilter(state);
    theme.apply(state);
  }

  transfer.init(state);

  renderAll();

  document.addEventListener('habits-changed', renderAll);
})();
