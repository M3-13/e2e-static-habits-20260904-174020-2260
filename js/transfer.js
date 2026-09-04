(function (global) {
  'use strict';

  function showError(message) {
    var existing = document.getElementById('transfer-alert');
    if (existing) {
      existing.remove();
    }
    if (!message) {
      return;
    }
    var alert = document.createElement('div');
    alert.id = 'transfer-alert';
    alert.className = 'alert';
    alert.setAttribute('role', 'alert');
    alert.textContent = message;
    var main = document.querySelector('.app-main');
    if (main) {
      main.insertBefore(alert, main.firstChild);
    } else {
      document.body.insertBefore(alert, document.body.firstChild);
    }
  }

  function downloadExport() {
    var data = store.exportData();
    var blob;
    try {
      blob = new Blob([data], { type: 'application/json' });
    } catch (e) {
      showError('Der Export ist fehlgeschlagen.');
      return;
    }
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'habit-tracker-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function importFile(state, file) {
    var reader = new FileReader();
    reader.onload = function () {
      var text = typeof reader.result === 'string' ? reader.result : '';
      var result = store.importData(text);
      if (result.ok) {
        state.habits = result.habits;
        store.saveState(state);
        showError('');
        document.dispatchEvent(new CustomEvent('habits-changed'));
      } else {
        showError(result.error);
      }
    };
    reader.onerror = function () {
      showError('Die Datei konnte nicht gelesen werden.');
    };
    reader.readAsText(file);
  }

  global.transfer = {
    init: function (state) {
      var exportBtn = document.getElementById('export-btn');
      var importBtn = document.getElementById('import-btn');
      var importFileInput = document.getElementById('import-file');

      if (exportBtn) {
        exportBtn.addEventListener('click', downloadExport);
      }
      if (importBtn && importFileInput) {
        importBtn.addEventListener('click', function () {
          importFileInput.click();
        });
        importFileInput.addEventListener('change', function () {
          var file = importFileInput.files && importFileInput.files[0];
          if (!file) {
            return;
          }
          importFile(state, file);
          importFileInput.value = '';
        });
      }
    }
  };
})(globalThis);
