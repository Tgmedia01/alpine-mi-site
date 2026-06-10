/* ───────── ALPINE MI — Shared JS (loader + nav + reveals) ───────── */
(function(){
  // LOADER — DISABLED. Hide instantly and run the reveal sequence on DOMContentLoaded.
  const loader=document.getElementById('loader');
  const nav=document.querySelector('nav.main-nav');
  if(loader){loader.style.display='none';loader.classList.add('out');}
  function reveal(){
    if(nav)nav.classList.add('in');
    document.querySelectorAll('.phero-h1 .ws, .hh .ws').forEach(el=>{
      const d=parseInt(el.dataset.d||0);
      setTimeout(()=>el.classList.add('in'),60+d);
    });
    document.querySelectorAll('[data-load-in]').forEach(el=>{
      const d=parseInt(el.dataset.loadIn||0);
      setTimeout(()=>el.classList.add('in'),120+d);
    });
    document.querySelectorAll('.h-eyebrow').forEach(el=>el.classList.add('in'));
    const hp=document.getElementById('hplate');if(hp)setTimeout(()=>hp.classList.add('in'),200);
    const hf=document.getElementById('hfoot');if(hf)setTimeout(()=>hf.classList.add('in'),320);
  }
  if(document.readyState!=='loading')reveal();else document.addEventListener('DOMContentLoaded',reveal);

  // NAV HIDE ON DOWN-SCROLL
  let ly=0;
  window.addEventListener('scroll',()=>{
    if(!nav)return;
    const y=window.scrollY;
    if(y>140 && y>ly){nav.style.transform='translateY(-110%)';}else{nav.style.transform='';}
    ly=y;
  },{passive:true});

  // REVEALS
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});
  },{threshold:0.12});
  document.querySelectorAll('.rev, .sli, .pstep, #qb, .sector, .pcard, .scap, .timeline-row, .principle, .form-row').forEach((el,i)=>{
    el.style.transitionDelay=(i%6)*70+'ms';obs.observe(el);
  });

  // STAT COUNT-UP
  const sobs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const fig=e.target.querySelector('.stat-fig');
      if(!fig)return;
      const tgt=parseInt(fig.dataset.count||'0',10);
      const span=fig.querySelector('span:first-child');
      if(!span){sobs.unobserve(e.target);return;}
      const t0=performance.now();
      function run(now){
        const k=Math.min((now-t0)/1100,1);
        const v=Math.floor((1-Math.pow(1-k,3))*tgt);
        span.textContent=v;
        if(k<1)requestAnimationFrame(run);else span.textContent=tgt;
      }
      requestAnimationFrame(run);
      sobs.unobserve(e.target);
    });
  },{threshold:0.4});
  document.querySelectorAll('.stat').forEach(s=>sobs.observe(s));
})();
