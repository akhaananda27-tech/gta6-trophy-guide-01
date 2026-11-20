// views.js: everything the page shows, built from the trophy data and the state.
// No network calls here — only DOM building from data already loaded.

import { GRADE_LABELS, STAGES, countTarget, trophyById } from './data.js';
import { spoilerMask } from './filters.js';
import { earnedCount } from './store.js';

// el: build one element with a class and text, safely (no HTML injection).
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

// renderChecklist: the trophy rows for the visible list.
// handlers: { onSelect(id), onToggle(id, earned) }.
export function renderChecklist(container, visible, state, handlers) {
  container.replaceChildren();
  for (const trophy of visible) {
    const row = el('li', 'trophy-row');
    const earned = Boolean(state.earned[trophy.id]);
    if (earned) row.classList.add('earned');
    if (state.selectedId === trophy.id) row.classList.add('selected');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'trophy-check';
    check.checked = earned;
    check.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    check.addEventListener('change', () => handlers.onToggle(trophy.id, check.checked));
    check.addEventListener('click', (event) => event.stopPropagation());
    row.appendChild(check);

    const medal = el('span', `medal ${trophy.grade}`, GRADE_LABELS[trophy.grade]);
    row.appendChild(medal);

    const main = el('div', 'trophy-main');
    const masked = spoilerMask(trophy, state);
    if (masked) {
      main.appendChild(el('div', 'trophy-name masked', 'Hidden trophy — earn it to reveal'));
      main.appendChild(el('div', 'trophy-desc masked', 'Story trophy. Its name and description stay hidden in spoiler-free mode until you earn it.'));
    } else {
      main.appendChild(el('div', 'trophy-name', trophy.name));
      main.appendChild(el('div', 'trophy-desc', trophy.description));
    }
    const tags = el('div', 'trophy-tags');
    tags.appendChild(el('span', 'tag', trophy.kind));
    if (trophy.missable) tags.appendChild(el('span', 'tag missable', 'Missable'));
    if (trophy.count) tags.appendChild(el('span', 'tag count', `${Number(trophy.count).toLocaleString('en-US')} ${trophy.countLabel || ''}`.trim()));
    main.appendChild(tags);
    row.appendChild(main);

    row.appendChild(el('span', 'trophy-grade', trophy.grade));
    row.addEventListener('click', () => handlers.onSelect(trophy.id));
    container.appendChild(row);
  }
}

// renderDetail: the guide pane for the selected trophy, with its sources.
export function renderDetail(container, trophies, state, handlers) {
  const trophy = trophyById(trophies, state.selectedId) || trophies[0];
  container.replaceChildren();
  if (!trophy) return;

  const masked = spoilerMask(trophy, state);
  container.appendChild(el('h3', null, masked ? 'Hidden trophy' : trophy.name));
  container.appendChild(el('p', 'detail-grade', `${trophy.grade} · ${trophy.kind}${trophy.missable ? ' · Missable' : ''}`));
  container.appendChild(el('p', 'detail-desc', masked ? 'This story trophy is hidden in spoiler-free mode. Earn it (or turn spoiler-free mode off) to read its official description.' : trophy.description));

  const target = countTarget(trophy);
  if (target) container.appendChild(el('p', 'detail-count', target));

  if (trophy.missable && trophy.missableNote) {
    const callout = el('p', 'missable-callout');
    const strong = el('strong', null, 'Missable — ');
    callout.appendChild(strong);
    callout.appendChild(document.createTextNode(trophy.missableNote));
    container.appendChild(callout);
  }

  const guide = el('p', 'detail-guide');
  guide.appendChild(el('strong', null, 'Guide'));
  guide.appendChild(document.createTextNode(masked ? 'Hidden until this trophy is earned.' : trophy.guide));
  container.appendChild(guide);

  const sources = el('div', 'detail-sources');
  sources.appendChild(el('strong', null, 'Sources'));
  const list = el('ul');
  for (const source of trophy.sources || []) {
    const item = el('li');
    const link = el('a', null, source.label);
    link.href = source.url;
    link.rel = 'noopener';
    item.appendChild(link);
    list.appendChild(item);
  }
  const own = el('li', null, 'Guide: our own words from the official description, not yet checked in the game.');
  list.appendChild(own);
  sources.appendChild(list);
  container.appendChild(sources);

  const actions = el('div', 'detail-actions');
  const earned = Boolean(state.earned[trophy.id]);
  const toggle = el('button', 'btn', earned ? 'Mark as not earned' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => handlers.onToggle(trophy.id, !earned));
  actions.appendChild(toggle);
  const next = trophies.find((item) => !state.earned[item.id] && item.id !== trophy.id);
  if (next) {
    const nextBtn = el('button', 'btn ghost', `Next up: ${next.name}`);
    nextBtn.type = 'button';
    nextBtn.addEventListener('click', () => handlers.onSelect(next.id));
    actions.appendChild(nextBtn);
  }
  container.appendChild(actions);
}

// renderRoadmap: the six stages in order, each with its trophies and progress.
export function renderRoadmap(container, trophies, state) {
  container.replaceChildren();
  for (const stage of STAGES) {
    const members = trophies.filter((trophy) => trophy.roadmapStage === stage.id);
    const done = members.filter((trophy) => state.earned[trophy.id]).length;
    const card = el('article', 'stage');
    card.appendChild(el('h3', null, stage.title));
    card.appendChild(el('p', 'stage-count', `${done} / ${members.length} earned`));
    card.appendChild(el('p', null, stage.text));
    const list = el('ul');
    for (const trophy of members) {
      const item = el('li', state.earned[trophy.id] ? 'earned' : null, spoilerMask(trophy, state) ? 'Hidden trophy' : trophy.name);
      list.appendChild(item);
    }
    card.appendChild(list);
    container.appendChild(card);
  }
}

// renderMissables: the flagged missable trophies, with their reasons.
export function renderMissables(container, trophies) {
  container.replaceChildren();
  const flagged = trophies.filter((trophy) => trophy.missable);
  for (const trophy of flagged) {
    const card = el('article', 'missable-card');
    card.appendChild(el('h3', null, trophy.name));
    card.appendChild(el('p', null, trophy.description));
    card.appendChild(el('p', null, trophy.missableNote || 'Flagged as missable from its official description.'));
    const guide = el('p', null, trophy.guide);
    card.appendChild(guide);
    container.appendChild(card);
  }
}

// renderResultCount: the "Showing X of 55" line under the filters.
export function renderResultCount(node, visible, total, state) {
  const parts = [`Showing ${visible.length} of ${total} trophies`];
  if (state.kind !== 'all') parts.push(`· ${state.kind}`);
  if (state.query.trim()) parts.push(`· matching “${state.query.trim()}”`);
  node.textContent = parts.join(' ');
}

// updateProgress: the masthead bar, count and the platinum line.
export function updateProgress(fill, text, sub, trophies, state) {
  const done = earnedCount(state);
  const total = trophies.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  fill.style.width = `${percent}%`;
  text.textContent = `${done} / ${total} earned`;
  if (done === total) {
    sub.textContent = 'Platinum 100% — Vice Got a Price! is yours.';
  } else if (done === 0) {
    sub.textContent = 'Platinum 0% — start the story';
  } else {
    sub.textContent = `Platinum ${percent}% — ${total - done} to go`;
  }
}
