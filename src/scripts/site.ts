const html = document.documentElement;
const themeButton = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
let savedTheme: string | null = null;
try { savedTheme = localStorage.getItem('pico-theme'); } catch { /* Storage may be unavailable. */ }

function setTheme(theme: 'light' | 'dark') {
  html.dataset.theme = theme;
  const label = theme === 'dark' ? '切换为浅色模式' : '切换为深色模式';
  themeButton?.setAttribute('aria-label', label);
  themeButton?.setAttribute('title', label);
  document.querySelector('#theme-color')?.setAttribute('content', theme === 'dark' ? '#111827' : '#FFFFFF');
}

setTheme(html.dataset.theme === 'dark' ? 'dark' : 'light');
themeButton?.addEventListener('click', () => {
  const theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  savedTheme = theme;
  setTheme(theme);
  try { localStorage.setItem('pico-theme', theme); } catch { /* Continue with the in-memory choice. */ }
});
systemTheme.addEventListener('change', event => {
  if (savedTheme !== 'light' && savedTheme !== 'dark') setTheme(event.matches ? 'dark' : 'light');
});
window.addEventListener('storage', event => {
  if (event.key !== 'pico-theme' && event.key !== null) return;
  savedTheme = event.key === null ? null : event.newValue;
  setTheme(savedTheme === 'dark' || (savedTheme !== 'light' && systemTheme.matches) ? 'dark' : 'light');
});

const dropdowns = [...document.querySelectorAll<HTMLDetailsElement>('[data-dropdown]')];
const desktop = matchMedia('(min-width: 1121px)');
const timers = new Map<HTMLDetailsElement, ReturnType<typeof setTimeout>>();
const pinned = new Set<HTMLDetailsElement>();

function setDropdown(group: HTMLDetailsElement, open: boolean) {
  clearTimeout(timers.get(group));
  group.open = open;
  group.querySelector('summary')?.setAttribute('aria-expanded', String(open));
  if (!open) pinned.delete(group);
}
function closeDropdowns(except?: HTMLDetailsElement) {
  dropdowns.forEach(group => { if (group !== except) setDropdown(group, false); });
}
dropdowns.forEach(group => {
  const summary = group.querySelector<HTMLElement>('summary');
  summary?.setAttribute('aria-expanded', 'false');
  group.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !desktop.matches) return;
    closeDropdowns(group);
    setDropdown(group, true);
  });
  group.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(timers.get(group));
    timers.set(group, setTimeout(() => {
      if (!pinned.has(group) && !group.contains(document.activeElement)) setDropdown(group, false);
    }, 120));
  });
  summary?.addEventListener('click', event => {
    event.preventDefault();
    const open = !group.open || !pinned.has(group);
    closeDropdowns(group);
    setDropdown(group, open);
    if (open) pinned.add(group);
  });
  group.addEventListener('focusout', event => {
    if (!group.contains(event.relatedTarget as Node | null)) setDropdown(group, false);
  });
});

const header = document.querySelector<HTMLElement>('[data-header]');
const mobileButton = document.querySelector<HTMLButtonElement>('[data-mobile-toggle]');
const mobileNavigation = document.querySelector<HTMLElement>('#mobile-navigation');

function setMobile(open: boolean) {
  if (!mobileNavigation) return;
  mobileNavigation.hidden = !open;
  mobileButton?.setAttribute('aria-expanded', String(open));
  mobileButton?.setAttribute('aria-label', open ? '收起导航菜单' : '展开导航菜单');
  header?.classList.toggle('mobile-open', open);
  if (!open) mobileNavigation.querySelectorAll('details').forEach(group => { group.open = false; });
}
mobileButton?.addEventListener('click', () => {
  closeDropdowns();
  setMobile(mobileNavigation?.hasAttribute('hidden') ?? true);
});
mobileNavigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMobile(false)));
desktop.addEventListener('change', () => { closeDropdowns(); setMobile(false); });

document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  if (!event.target.closest('[data-dropdown]')) closeDropdowns();
  if (!event.target.closest('#mobile-navigation') && !event.target.closest('[data-mobile-toggle]')) setMobile(false);
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const openGroup = dropdowns.find(group => group.open);
  closeDropdowns();
  if (mobileNavigation && !mobileNavigation.hidden) { setMobile(false); mobileButton?.focus(); }
  else openGroup?.querySelector<HTMLElement>('summary')?.focus();
});

const toast = document.querySelector<HTMLElement>('[data-toast]');
let toastTimer: ReturnType<typeof setTimeout>;
document.querySelectorAll<HTMLButtonElement>('[data-notice]').forEach(button => {
  button.addEventListener('click', () => {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = button.dataset.notice ?? '';
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
  });
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.addEventListener('animationend', () => entry.target.classList.remove('reveal-pending', 'is-visible'), { once: true });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
    // Already-visible content is never hidden while the first observer callback waits.
    const bounds = element.getBoundingClientRect();
    if (bounds.top < innerHeight && bounds.bottom > 0) return;
    element.classList.add('reveal-pending');
    observer.observe(element);
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { document.querySelectorAll('.reveal-pending').forEach(element => element.classList.remove('reveal-pending', 'is-visible')); observer.disconnect(); }
  });
}
