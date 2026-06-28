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

  // NAV HIDE ON SCROLL — 80px hysteresis prevents inertial-scroll flicker
  let ly=0, hiddenAt=0;
  window.addEventListener('scroll',()=>{
    if(!nav) return;
    const y = window.scrollY;
    if(y > 140 && y > ly){
      nav.style.transform = 'translateY(-110%)';
      hiddenAt = y;
    } else if(y < hiddenAt - 80){
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
