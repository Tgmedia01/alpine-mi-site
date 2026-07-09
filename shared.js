/* ───────── ALPINE MI — Shared JS (loader + nav + reveals) ───────── */
(function(){

  // LOADER — hide instantly, run reveal sequence
  const loader = document.getElementById('loader');
  const nav    = document.querySelector('nav.main-nav');
  if(loader){ loader.style.display='none'; loader.classList.add('out'); }

  function reveal(){
    if(nav) nav.classList.add('in');
    document.querySelectorAll('.phero-h1 .ws, .hh .ws').forEach(el=>{
      const d = parseInt(el.dataset.d||0);
      setTimeout(()=>el.classList.add('in'), 60+d);
    });
    document.querySelectorAll('[data-load-in]').forEach(el=>{
      const d = parseInt(el.dataset.loadIn||0);
      setTimeout(()=>el.classList.add('in'), 120+d);
    });
    document.querySelectorAll('.h-eyebrow').forEach(el=>el.classList.add('in'));
    const hp = document.getElementById('hplate'); if(hp) setTimeout(()=>hp.classList.add('in'),200);
    const hf = document.getElementById('hfoot');  if(hf) setTimeout(()=>hf.classList.add('in'),320);
  }
  if(document.readyState!=='loading') reveal();
  else document.addEventListener('DOMContentLoaded', reveal);

  // NAV SCROLL BEHAVIOURS
  // is-scrolled — adds subtle border once user has scrolled at all
  // hide/show   — hide when user scrolls past the hero/phero section,
  //               show again only when they scroll back near the top
  let ly = 0, hiddenAt = 0;

  function getHeroBottom(){
    // Home page uses .hero; subpages use .phero
    const hero = document.querySelector('.hero, .phero');
    if(hero) return hero.getBoundingClientRect().bottom + window.scrollY;
    return window.innerHeight; // fallback: one viewport height
  }

  window.addEventListener('scroll',()=>{
    if(!nav) return;
    const y = window.scrollY;

    // subtle bottom border once off the very top
    nav.classList.toggle('is-scrolled', y > 5);

    // hide when scrolled past hero; show when near top or scrolling back up enough
    const heroBottom = getHeroBottom();
    if(y > heroBottom && y > ly){
      nav.style.transform = 'translateY(-110%)';
      hiddenAt = y;
    } else if(y < 80){
      nav.style.transform = '';
      hiddenAt = 0;
    } else if(hiddenAt > 0 && y < hiddenAt - 120){
      nav.style.transform = '';
      hiddenAt = 0;
    }
    ly = y;
  },{passive:true});

  // MOBILE MENU TOGGLE
  // Runs immediately (not gated on DOMContentLoaded) so the IIFE catches
  // elements that are already in the DOM when the script executes at body end.
  // Falls back to DOMContentLoaded for pages that load script in <head>.
  function initMobileMenu(){
    const burger = document.querySelector('.nav-burger');
    const drawer = document.getElementById('mobile-menu');
    if(!burger || !drawer) return;
    if(burger._menuBound) return; // guard against double-init
    burger._menuBound = true;

    function openMenu(){
      burger.classList.add('open');
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      burger.setAttribute('aria-expanded','true');
    }
    function closeMenu(){
      burger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded','false');
    }

    // Toggle handler — preventDefault stops iOS from firing both
    // touchstart and click on the same tap (double-fire prevention)
    function toggleMenu(e){
      e.preventDefault();
      burger.classList.contains('open') ? closeMenu() : openMenu();
    }

    burger.addEventListener('click',     toggleMenu, { passive: false });
    burger.addEventListener('touchstart', toggleMenu, { passive: false });

    // Close on any drawer link tap (both events)
    drawer.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click',      closeMenu, { passive: true });
      a.addEventListener('touchstart', closeMenu, { passive: true });
    });

    // Close on Escape key
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });
  }

  // Try immediately (script at bottom of body) then also on DOMContentLoaded
  initMobileMenu();
  document.addEventListener('DOMContentLoaded', initMobileMenu);

  // REVEALS — individual elements, no global stagger index
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.rev, .sli, .pstep, #qb, .sector, .pcard, .scap, .timeline-row, .principle, .form-row').forEach(el=>{
    obs.observe(el);
  });

  // PER-GROUP STAGGER — stagger resets fresh for each section as it enters view
  const groupObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      [...e.target.children].forEach((child,i)=>{
        child.style.transitionDelay = (i%6)*70+'ms';
      });
      groupObs.unobserve(e.target);
    });
  },{threshold:0.08});
  document.querySelectorAll('.pillars-grid, .princ-list, .tlist-grid, .client-grid, .proc-grid, .stats, .cs-stats').forEach(el=>{
    groupObs.observe(el);
  });

  // STAT COUNT-UP
  const sobs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const fig  = e.target.querySelector('.stat-fig');
      if(!fig) return;
      const tgt  = parseInt(fig.dataset.count||'0',10);
      const span = fig.querySelector('span:first-child');
      if(!span){ sobs.unobserve(e.target); return; }
      const t0 = performance.now();
      function run(now){
        const k = Math.min((now-t0)/1100,1);
        span.textContent = Math.floor((1-Math.pow(1-k,3))*tgt);
        if(k<1) requestAnimationFrame(run); else span.textContent = tgt;
      }
      requestAnimationFrame(run);
      sobs.unobserve(e.target);
    });
  },{threshold:0.4});
  document.querySelectorAll('.stat').forEach(s=>sobs.observe(s));

})();

// ── HORIZONTAL PROJECT TRACK DRAG-TO-SCROLL ──
(function(){
  const track = document.getElementById('htrack');
  if(!track) return;

  const wrap = track.parentElement; // .htrack-outer
  let isDown = false, startX = 0, scrollX = 0, didDrag = false;

  // Enable horizontal scroll (CSS has overflow:hidden as fallback; JS overrides X axis)
  wrap.style.overflowX = 'auto';
  wrap.style.scrollbarWidth = 'none'; // Firefox
  // Webkit scrollbar hide
  const _s = document.createElement('style');
  _s.textContent = '.htrack-outer::-webkit-scrollbar{display:none}';
  document.head.appendChild(_s);
  track.style.cursor = 'grab';

  track.addEventListener('pointerdown', e => {
    isDown = true; didDrag = false;
    startX = e.clientX; scrollX = wrap.scrollLeft;
    track.setPointerCapture(e.pointerId);
    track.style.cursor = 'grabbing';
  });

  track.addEventListener('pointermove', e => {
    if(!isDown) return;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > 4) didDrag = true;
    wrap.scrollLeft = scrollX - dx;
  });

  track.addEventListener('pointerup', e => {
    // Must release capture so child <a> elements can receive click events
    if(track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    isDown = false;
    track.style.cursor = 'grab';
  });

  // Suppress navigation only when the gesture was a real drag (>4px movement)
  track.addEventListener('click', e => {
    if(didDrag){ e.preventDefault(); e.stopPropagation(); didDrag = false; }
  }, { capture: true });

  // Shift+wheel = horizontal scroll on desktop trackpads/mice
  wrap.addEventListener('wheel', e => {
    if(e.shiftKey){ wrap.scrollLeft += e.deltaY; e.preventDefault(); }
  }, { passive: false });
})();
