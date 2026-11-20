// loadTrophies: fetch the official list (with our guides) from data/trophies.json.
// The file lives under app/, so this fetch never leaves the app's own server.
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const data = await response.json();
  const trophies = Array.isArray(data) ? data : data.trophies;
  return { meta: data.meta || null, trophies };
}

// STAGES: the roadmap to the platinum, in the order to earn them.
// Built from the official descriptions: story first, then strangers,
// then activities and challenges, then collectibles, then money, then clean-up.
export const STAGES = [
  { id: 1, title: '1 · Play the story', text: 'Chapters 1–4, the final mission, the story missions and the story beats. Nothing here is missable except the showroom escape and the stranger strands — see Missables.' },
  { id: 2, title: '2 · Strangers & friends', text: 'The five character finales (Andy, Kenton, Billy, Randy, Tyrone) and the 8 stranger strands. Do the stranger strands before the final mission.' },
  { id: 3, title: '3 · Activities & challenges', text: 'Races, shooting range, stunts, fishing, arcade, bowling, meditation, hunting, partner activities and heists. Most of these can be done any time after they unlock.' },
  { id: 4, title: '4 · Collectibles & exploration', text: 'Cards, WAiNK spots, vehicles, the whole map, garages and registrations. Best done while travelling between activities.' },
  { id: 5, title: '5 · Money', text: 'Launder $250,000 of Marked Bills and spend $100,000 across the shops. The money comes naturally from heists and robberies.' },
  { id: 6, title: '6 · Clean-up & platinum', text: '100% completion, then the platinum unlocks on its own. Check the in-game 100% list against this tracker.' },
];

// GRADE_LABELS: the single letter in the medal beside each trophy.
// The full grade word is spelled out at the row's right edge.
export const GRADE_LABELS = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

// trophyById: find one trophy by its id.
export function trophyById(trophies, id) {
  return trophies.find((trophy) => trophy.id === id) || null;
}

// countTarget: the PSN target line for a trophy with a count, or null.
export function countTarget(trophy) {
  if (!trophy.count) return null;
  const target = Number(trophy.count).toLocaleString('en-US');
  return `Target: ${target} ${trophy.countLabel || ''}`.trim();
}
