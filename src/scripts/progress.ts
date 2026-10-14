export {};

const board = document.querySelector<HTMLElement>('[data-progress-board]');
const track = board?.querySelector<HTMLElement>('[data-progress-track]');
const cards = [...(board?.querySelectorAll<HTMLElement>('[data-progress-card]') ?? [])];
const previous = board?.querySelector<HTMLButtonElement>('[data-progress-prev]');
const next = board?.querySelector<HTMLButtonElement>('[data-progress-next]');
const counter = board?.querySelector<HTMLElement>('[data-progress-counter]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (track && cards.length && previous && next && counter) {
  let current = 0;
  let target = 0;
  function update() {
    if (!track || !previous || !next || !counter) return;
    const start = track.getBoundingClientRect().left + track.clientLeft;
    current = cards.reduce((nearest, card, index) =>
      Math.abs(card.getBoundingClientRect().left - start) < Math.abs(cards[nearest].getBoundingClientRect().left - start) ? index : nearest, 0);
    previous.disabled = current === 0;
    next.disabled = current === cards.length - 1;
    counter.textContent = `第${cards[current].dataset.week}周 · ${current + 1} / ${cards.length}`;
  }
  function goTo(index: number) {
    if (!track) return;
    target = Math.max(0, Math.min(cards.length - 1, index));
    const left = cards[target].getBoundingClientRect().left - track.getBoundingClientRect().left - track.clientLeft + track.scrollLeft;
    track.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => goTo(target - 1));
  next.addEventListener('click', () => goTo(target + 1));
  track.addEventListener('scroll', update, { passive: true });
  track.addEventListener('scrollend', () => { update(); target = current; });
  // A manual scroll starts a new navigation position, including on older browsers.
  track.addEventListener('pointerdown', () => { target = current; });
  track.addEventListener('wheel', () => { target = current; }, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    const destinations: Record<string, number> = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: cards.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    goTo(destinations[event.key]);
  });
  new ResizeObserver(() => { goTo(current); update(); }).observe(track);
  const controls = board?.querySelector<HTMLElement>('[data-progress-controls]');
  if (controls) controls.hidden = cards.length < 2;
  update();
}
