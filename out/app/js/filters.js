// filters.js: which trophies the checklist shows, and what spoiler mode hides.

// KIND_LABELS: the filter chips, in the order the page shows them.
export const KIND_LABELS = {
  all: 'All 55',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  challenge: 'Challenge',
  platinum: 'Platinum',
};

// applyFilters: the visible trophies for the current kind, search and earned state.
// kind 'missable' shows only the flagged missable trophies; the search matches
// the name and the official description.
export function applyFilters(trophies, state) {
  const query = (state.query || '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (state.kind === 'missable' && !trophy.missable) return false;
    if (state.kind !== 'all' && state.kind !== 'missable' && trophy.kind !== state.kind) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

// spoilerMask: in spoiler mode, a story trophy that is not earned yet shows
// as hidden — its name and description stay hidden until it is earned.
// Every other trophy is shown as normal.
export function spoilerMask(trophy, state) {
  if (!state.spoiler) return false;
  if (trophy.kind !== 'story') return false;
  return !state.earned[trophy.id];
}

// isVisibleKind: whether a trophy belongs to the kind a chip names.
export function isVisibleKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable;
  return trophy.kind === kind;
}

// filterCounts: how many trophies each kind holds, for the result line.
export function filterCounts(trophies) {
  const counts = { all: trophies.length, missable: 0 };
  for (const trophy of trophies) {
    counts[trophy.kind] = (counts[trophy.kind] || 0) + 1;
    if (trophy.missable) counts.missable += 1;
  }
  return counts;
}
