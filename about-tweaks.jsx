/* Alpine MI — About page tweaks */
const ALPINE_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "ink",
  "display": "grotesk",
  "surface": "clean"
}/*EDITMODE-END*/;

const PALETTES = {
  ink:      { paper:'#FFFFFF', paper2:'#F2F2F2', ink:'#000000', mid:'#7A7A7A', accent:'#00E5C2', accentInk:'#000000', label:'Ink · Teal' },
  cream:    { paper:'#F1EADC', paper2:'#E5DCC8', ink:'#1A1410', mid:'#806F5C', accent:'#C8462A', accentInk:'#F1EADC', label:'Cream · Oxblood' },
  bone:     { paper:'#ECEAE0', paper2:'#DFDCD0', ink:'#121620', mid:'#5E667A', accent:'#2750E8', accentInk:'#FFFFFF', label:'Bone · Cobalt' },
  concrete: { paper:'#E5E5E3', paper2:'#D6D6D2', ink:'#171717', mid:'#737373', accent:'#FF5722', accentInk:'#FFFFFF', label:'Concrete · Ember' }
};

const DISPLAY = {
  grotesk:    { stack:"'Space Grotesk','Inter',system-ui,sans-serif", weight:700, tracking:'-0.06em', case:'uppercase', italic:'normal', label:'Grotesk' },
  serif:      { stack:"'Fraunces',Georgia,serif",                     weight:600, tracking:'-0.035em', case:'none',       italic:'italic',  label:'Serif' },
  industrial: { stack:"'Archivo Black','Inter',system-ui,sans-serif", weight:900, tracking:'-0.045em', case:'uppercase', italic:'normal', label:'Industrial' },
  mono:       { stack:"'JetBrains Mono',ui-monospace,monospace",      weight:700, tracking:'-0.04em',  case:'uppercase', italic:'normal', label:'Mono' }
};

const SURFACES = {
  clean: { label:'Clean' },
  grain: { label:'Grain' },
  grid:  { label:'Grid' },
  hatch: { label:'Hatch' }
};

function loadFonts(){
  if(document.getElementById('alpine-tweak-fonts'))return;
  const link=document.createElement('link');
  link.id='alpine-tweak-fonts';
  link.rel='stylesheet';
  link.href='https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600;1,9..144,700&family=Archivo+Black&display=swap';
  document.head.appendChild(link);
}

const PALETTE_KEYS = Object.keys(PALETTES);
const PALETTE_OPTS = PALETTE_KEYS.map(k=>[PALETTES[k].paper, PALETTES[k].ink, PALETTES[k].accent]);

function App(){
  const [t,setTweak]=useTweaks(ALPINE_TWEAK_DEFAULTS);
  React.useEffect(()=>{loadFonts();},[]);

  React.useEffect(()=>{
    const p=PALETTES[t.palette]||PALETTES.ink;
    const r=document.documentElement;
    r.style.setProperty('--paper',p.paper);
    r.style.setProperty('--paper-2',p.paper2);
    r.style.setProperty('--ink',p.ink);
    r.style.setProperty('--ink-2',p.ink);
    r.style.setProperty('--mid',p.mid);
    r.style.setProperty('--teal',p.accent);
    r.style.setProperty('--accent-ink',p.accentInk);
    const rgb=hexToRgb(p.ink);
    r.style.setProperty('--rule',`rgba(${rgb},0.12)`);
    r.style.setProperty('--rule-strong',`rgba(${rgb},0.4)`);
    document.body.setAttribute('data-palette',t.palette);
  },[t.palette]);

  React.useEffect(()=>{
    const d=DISPLAY[t.display]||DISPLAY.grotesk;
    const r=document.documentElement;
    r.style.setProperty('--fd',d.stack);
    r.style.setProperty('--display-weight',d.weight);
    r.style.setProperty('--display-tracking',d.tracking);
    r.style.setProperty('--display-case',d.case);
    r.style.setProperty('--display-italic',d.italic);
    document.body.setAttribute('data-display',t.display);
  },[t.display]);

  React.useEffect(()=>{
    document.body.setAttribute('data-surface',t.surface);
  },[t.surface]);

  const activeIdx=PALETTE_KEYS.indexOf(t.palette);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette" />
      <TweakColor
        label="Mood"
        value={PALETTE_OPTS[activeIdx>=0?activeIdx:0]}
        options={PALETTE_OPTS}
        onChange={(o)=>{
          const i=PALETTE_OPTS.findIndex(p=>p.join('|')===o.join('|'));
          if(i>=0)setTweak('palette', PALETTE_KEYS[i]);
        }}
      />
      <div style={{fontSize:10,letterSpacing:'.05em',textTransform:'uppercase',color:'rgba(41,38,27,.5)',marginTop:-4}}>
        {PALETTES[t.palette]?.label}
      </div>

      <TweakSection label="Display" />
      <TweakSelect
        label="Typeface"
        value={t.display}
        options={Object.keys(DISPLAY).map(k=>({value:k,label:DISPLAY[k].label}))}
        onChange={(v)=>setTweak('display', v)}
      />

      <TweakSection label="Surface" />
      <TweakRadio
        label="Treatment"
        value={t.surface}
        options={Object.keys(SURFACES)}
        onChange={(v)=>setTweak('surface', v)}
      />
    </TweaksPanel>
  );
}

function hexToRgb(h){
  const v=h.replace('#','');
  const n=parseInt(v.length===3?v.split('').map(c=>c+c).join(''):v,16);
  return `${(n>>16)&255},${(n>>8)&255},${n&255}`;
}

// Mount
const __root=document.createElement('div');
document.body.appendChild(__root);
ReactDOM.createRoot(__root).render(<App />);
