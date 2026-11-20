// store.js: progress saved in the browser (localStorage), plus export/import.
// Nothing here touches the network: export downloads a file, import reads one.

export const STORAGE_KEY = 'leonida-trophy-progress-v1';

// defaultState: a fresh tracker — nothing earned, no spoiler mode, all kinds.
export function defaultState() {
  return { earned: {}, spoiler: false, kind: 'all', query: '', selectedId: 25 };
}

// loadProgress: read the saved state, or fall back to a fresh one.
export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const saved = JSON.parse(raw);
    const state = defaultState();
    if (saved && typeof saved === 'object') {
      if (saved.earned && typeof saved.earned === 'object') state.earned = saved.earned;
      if (typeof saved.spoiler === 'boolean') state.spoiler = saved.spoiler;
      if (typeof saved.kind === 'string') state.kind = saved.kind;
      if (typeof saved.selectedId === 'number') state.selectedId = saved.selectedId;
      if (typeof saved.query === 'string') state.query = saved.query;
    }
    return state;
  } catch (error) {
    return defaultState();
  }
}

// saveProgress: write the state back to the browser.
export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      earned: state.earned,
      spoiler: state.spoiler,
      kind: state.kind,
      selectedId: state.selectedId,
      query: state.query || '',
    }));
  } catch (error) {
    // Storage can be full or blocked; the tracker still works in memory.
  }
}

// resetProgress: clear the saved state from the browser.
export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Nothing to clear; the tracker still works in memory.
  }
  return defaultState();
}

// earnedCount: how many trophies are ticked in the state.
export function earnedCount(state) {
  return Object.values(state.earned).filter(Boolean).length;
}
export function exportProgress(state) {
  const payload = JSON.stringify({ app: 'leonida-trophy-guide', version: 1, earned: state.earned }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leonida-trophy-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// importProgress: read an exported file and return its earned set, or null.
export async function importProgress(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  const earned = data && typeof data === 'object' ? (data.earned || data) : null;
  if (!earned || typeof earned !== 'object' || Array.isArray(earned)) return null;
  const clean = {};
  for (const [key, value] of Object.entries(earned)) {
    const id = Number(key);
    if (Number.isInteger(id) && id >= 1 && id <= 55 && value === true) clean[id] = true;
  }
  return clean;
}
