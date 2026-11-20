// main.js: boot the Leonida Trophy Guide and wire every control.
// The app loads data/trophies.json once, then runs entirely from local files.

import { loadTrophies } from './data.js';
import { defaultState, loadProgress, saveProgress, exportProgress, importProgress, resetProgress } from './store.js';
import { applyFilters, filterCounts } from './filters.js';
import { renderChecklist, renderDetail, renderRoadmap, renderMissables, renderResultCount, updateProgress } from './views.js';

// boot: load the data, restore the saved progress, then render everything.
async function boot() {
  const { trophies } = await loadTrophies();
  const state = loadProgress();
  const counts = filterCounts(trophies);

  const fill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressSub = document.getElementById('progress-sub');
  const search = document.getElementById('search');
  const spoilerToggle = document.getElementById('spoiler-toggle');
  const chips = document.getElementById('kind-chips');
  const resultCount = document.getElementById('result-count');
  const checklist = document.getElementById('checklist');
  const checklistEmpty = document.getElementById('checklist-empty');
  const checklistCount = document.getElementById('checklist-count');
  const detail = document.getElementById('detail');
  const roadmap = document.getElementById('roadmap-stages');
  const missables = document.getElementById('missable-list');
  const exportBtn = document.getElementById('export-btn');
  const importFile = document.getElementById('import-file');
  const resetBtn = document.getElementById('reset-btn');

  spoilerToggle.checked = state.spoiler;
  search.value = state.query || '';

  const handlers = {
    onSelect(id) {
      state.selectedId = id;
      saveProgress(state);
      renderAll();
    },
    onToggle(id, earned) {
      if (earned) state.earned[id] = true;
      else delete state.earned[id];
      saveProgress(state);
      renderAll();
    },
  };

  function renderAll() {
    const visible = applyFilters(trophies, state);
    renderChecklist(checklist, visible, state, handlers);
    renderDetail(detail, trophies, state, handlers);
    renderRoadmap(roadmap, trophies, state);
    renderMissables(missables, trophies);
    renderResultCount(resultCount, visible, trophies.length, state);
    updateProgress(fill, progressText, progressSub, trophies, state);
    checklistEmpty.hidden = visible.length > 0;
    checklistCount.textContent = `${visible.length} shown · ${counts.all} total`;
    for (const chip of chips.querySelectorAll('.chip')) {
      chip.setAttribute('aria-pressed', String(chip.dataset.kind === state.kind));
    }
  }

  search.addEventListener('input', () => {
    state.query = search.value;
    saveProgress(state);
    renderAll();
  });

  chips.addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    state.kind = chip.dataset.kind;
    saveProgress(state);
    renderAll();
  });

  spoilerToggle.addEventListener('change', () => {
    state.spoiler = spoilerToggle.checked;
    saveProgress(state);
    renderAll();
  });

  exportBtn.addEventListener('click', () => exportProgress(state));

  importFile.addEventListener('change', async () => {
    const file = importFile.files && importFile.files[0];
    if (!file) return;
    try {
      const earned = await importProgress(file);
      if (earned) {
        state.earned = earned;
        saveProgress(state);
        renderAll();
      }
    } catch (error) {
      // A bad file is ignored; the tracker keeps its current progress.
    }
    importFile.value = '';
  });

  resetBtn.addEventListener('click', () => {
    const fresh = resetProgress();
    Object.assign(state, fresh);
    search.value = '';
    spoilerToggle.checked = false;
    renderAll();
  });

  renderAll();
}

// boot the app; if the data cannot load, say so in the guide pane.
boot().catch((error) => {
  const detail = document.getElementById('detail');
  if (detail) detail.textContent = 'Could not load the trophy list. Serve app/ from a static server and reload.';
});
