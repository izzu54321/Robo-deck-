/* ---------------- Config ---------------- */
const ROBOTS = ['r1.jpeg','r2.jpeg','r3.jpeg','r4.jpeg','r5.jpeg','r6.jpeg','r7.jpeg'].map(f=>'assets/'+f);

const ACTIONS = [
  'walk-left','walk-right','climb-ladder','hang-top','sit-chair',
  'drive-car','ride-bike','ride-cycle'
];

const state = {
  scene:'street',       // street | sky | workshop | space
  count:1,              // 1 | 2 | 5
  vehicle:'auto',        // auto | car | bike | cycle | none
  speed:'normal',        // slow | normal | fast
  theme:'dark',          // dark | neon | sunset
  moves:0
};

const stage = document.getElementById('stage');
const moveCountEl = document.getElementById('moveCount');
const actNameEl = document.getElementById('actName');

const SPEED_MS = {slow:2600, normal:1500, fast:800};

/* ---------------- Vehicle SVGs ---------------- */
function svgCar(){
  return `<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 34 Q8 18 26 16 L40 16 Q48 6 66 6 L86 6 Q98 6 104 18 L112 20 Q118 22 118 30 L118 34 Z" fill="var(--accent-2)" opacity="0.9"/>
    <rect x="4" y="30" width="112" height="8" rx="4" fill="#12161f"/>
    <circle class="wheel" cx="30" cy="40" r="9" fill="#0a0d13" stroke="var(--accent)" stroke-width="3"/>
    <circle class="wheel" cx="92" cy="40" r="9" fill="#0a0d13" stroke="var(--accent)" stroke-width="3"/>
  </svg>`;
}
function svgBike(){
  return `<svg viewBox="0 0 110 60" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 50 L48 22 L70 22 L60 50" stroke="var(--accent-2)" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M48 22 L84 26" stroke="var(--accent-2)" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle class="wheel" cx="26" cy="50" r="13" fill="none" stroke="var(--accent)" stroke-width="4"/>
    <circle class="wheel" cx="86" cy="50" r="13" fill="none" stroke="var(--accent)" stroke-width="4"/>
  </svg>`;
}
function svgCycle(){
  return `<svg viewBox="0 0 100 56" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 46 L40 22 L58 46 M40 22 L52 22 L72 46 M22 46 L58 46" stroke="var(--accent-2)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle class="wheel" cx="22" cy="46" r="11" fill="none" stroke="var(--accent)" stroke-width="3"/>
    <circle class="wheel" cx="72" cy="46" r="11" fill="none" stroke="var(--accent)" stroke-width="3"/>
  </svg>`;
}
const VEHICLE_SVG = {car:svgCar, bike:svgBike, cycle:svgCycle};
function chairSVG(){
  return `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="4" height="46" fill="var(--muted)"/>
    <rect x="30" y="6" width="4" height="46" fill="var(--muted)"/>
    <rect x="6" y="26" width="28" height="4" fill="var(--muted)"/>
    <rect x="4" y="48" width="32" height="5" fill="var(--muted)"/>
  </svg>`;
}

/* ---------------- Movement performers ---------------- */
function randBotSrc(){ return ROBOTS[Math.floor(Math.random()*ROBOTS.length)]; }
function pctY(min,max){ return (min + Math.random()*(max-min)).toFixed(1)+'%'; }

function spawnBot(className, styleObj){
  const el = document.createElement('div');
  el.className = 'bot '+className;
  Object.assign(el.style, styleObj);
  const img = document.createElement('img');
  img.src = randBotSrc();
  el.appendChild(img);
  stage.appendChild(el);
  return el;
}

function actWalk(dir){
  const el = spawnBot('walking enter-'+dir, {
    top: pctY(58,74),
    left: dir==='left' ? '4%' : 'auto',
    right: dir==='right' ? '4%' : 'auto'
  });
  setTimeout(()=>el.remove(), 3200);
  return 'Walking in from '+dir;
}

function actClimb(){
  const x = pctY(15,80);
  const ladder = document.createElement('div');
  ladder.className='ladder';
  ladder.style.left = x;
  ladder.style.height = '55%';
  stage.appendChild(ladder);
  const el = spawnBot('', {left: x, top:'86%', transition:`top ${SPEED_MS[state.speed]*2}ms ease-in-out`});
  requestAnimationFrame(()=> requestAnimationFrame(()=>{ el.style.top='30%'; }));
  setTimeout(()=>{el.remove(); ladder.remove();}, SPEED_MS[state.speed]*2 + 900);
  return 'Climbing the ladder';
}

function actHang(){
  const x = pctY(15,80);
  const rope = document.createElement('div');
  rope.className='rope';
  rope.style.left = x;
  rope.style.height='30%';
  stage.appendChild(rope);
  const el = spawnBot('hanging', {left:x, top:'26%'});
  setTimeout(()=>{el.remove(); rope.remove();}, 3600);
  return 'Hanging from the top';
}

function actSit(){
  const x = '46%';
  const chair = document.createElement('div');
  chair.className='chair';
  chair.style.left = x;
  chair.innerHTML = chairSVG();
  stage.appendChild(chair);
  const el = spawnBot('enter-left', {left:'42%', top:'56%'});
  setTimeout(()=>{el.remove(); chair.remove();}, 3400);
  return 'Sat down on a chair';
}

function actRide(kind){
  const v = document.createElement('div');
  v.className='vehicle driving';
  v.style.width='120px';
  v.style.top = pctY(60,72);
  v.style.animationDuration = SPEED_MS[state.speed]*2.2+'ms';
  v.innerHTML = VEHICLE_SVG[kind]();
  stage.appendChild(v);
  const el = spawnBot('', {top:'0%', left:'0%', position:'absolute'});
  el.style.top = 'calc('+v.style.top+' - 34px)';
  el.style.transition = `left ${SPEED_MS[state.speed]*2.2}ms linear`;
  el.style.left='-14%';
  requestAnimationFrame(()=> requestAnimationFrame(()=>{ el.style.left='104%'; }));
  const dur = SPEED_MS[state.speed]*2.2 + 400;
  setTimeout(()=>{v.remove(); el.remove();}, dur);
  return {label:'Riding a '+kind, dur};
}

/* ---------------- Movement dispatcher ---------------- */
function pickAction(){
  let pool = ACTIONS.slice();
  if(state.vehicle!=='auto'){
    pool = pool.filter(a=>!['drive-car','ride-bike','ride-cycle'].includes(a));
    if(state.vehicle!=='none') pool.push('vehicle-forced');
  }
  return pool[Math.floor(Math.random()*pool.length)];
}

function runOneMovement(){
  const action = pickAction();
  let label = '';
  switch(action){
    case 'walk-left': label = actWalk('left'); break;
    case 'walk-right': label = actWalk('right'); break;
    case 'climb-ladder': label = actClimb(); break;
    case 'hang-top': label = actHang(); break;
    case 'sit-chair': label = actSit(); break;
    case 'drive-car': label = actRide('car').label; break;
    case 'ride-bike': label = actRide('bike').label; break;
    case 'ride-cycle': label = actRide('cycle').label; break;
    case 'vehicle-forced': label = actRide(state.vehicle).label; break;
  }
  state.moves++;
  moveCountEl.textContent = String(state.moves).padStart(3,'0');
  actNameEl.textContent = label;
}

function tick(){
  const howMany = state.count===5 ? (2+Math.floor(Math.random()*2)) : state.count===2 ? 2 : 1;
  for(let i=0;i<howMany;i++){
    setTimeout(runOneMovement, i*180);
  }
  const base = SPEED_MS[state.speed];
  const jitter = base*0.6*Math.random();
  setTimeout(tick, base + jitter);
}

/* ---------------- Dials ---------------- */
const DIALS = [
  {key:'scene', label:'SCENE', values:['street','sky','workshop','space']},
  {key:'count', label:'ROBOTS', values:[1,2,5]},
  {key:'vehicle', label:'VEHICLE', values:['auto','car','bike','cycle','none']},
  {key:'speed', label:'SPEED', values:['slow','normal','fast']},
  {key:'theme', label:'THEME', values:['dark','neon','sunset']},
];

const dialsWrap = document.getElementById('dials');

DIALS.forEach(d=>{
  const wrap = document.createElement('div');
  wrap.className='dial';

  const lbl = document.createElement('div');
  lbl.className='dial-label';
  lbl.textContent = d.label;

  const knob = document.createElement('div');
  knob.className='dial-knob';

  const val = document.createElement('div');
  val.className='dial-value';
  let idx = 0;
  val.textContent = d.values[idx];

  function applyValue(){
    state[d.key] = d.values[idx];
    val.textContent = d.values[idx];
    if(d.key==='scene') stage.dataset.scene = state.scene;
    if(d.key==='theme') document.body.dataset.theme = state.theme;
  }

  function spinTo(next){
    idx = next;
    knob.classList.remove('spin'); void knob.offsetWidth; knob.classList.add('spin');
    applyValue();
  }

  knob.addEventListener('click', ()=> spinTo((idx+1)%d.values.length));

  // touch/drag spin
  let startX=0;
  knob.addEventListener('pointerdown', e=>{ startX=e.clientX; knob.setPointerCapture(e.pointerId); });
  knob.addEventListener('pointerup', e=>{
    const dx = e.clientX-startX;
    if(Math.abs(dx)>18){ spinTo(dx>0 ? (idx+1)%d.values.length : (idx-1+d.values.length)%d.values.length); }
  });

  wrap.appendChild(knob);
  wrap.appendChild(val);
  wrap.appendChild(lbl);
  dialsWrap.appendChild(wrap);

  applyValue();
});

/* ---------------- Nature Image Generator (Pollinations.ai, free, no key) ---------------- */
const BLOCKED_WORDS = [
  'man','woman','men','women','boy','girl','child','children','kid','baby',
  'person','people','human','face','portrait','selfie','model','celebrity',
  'animal','dog','cat','bird','tiger','lion','elephant','horse','fish','insect',
  'bug','deer','wolf','bear','monkey','cow','goat','sheep','snake','robot',
  'zombie','soldier','warrior','nude','naked','sexy','gore','blood','weapon','gun'
];
const genPrompt = document.getElementById('genPrompt');
const genBtn = document.getElementById('genBtn');
const genWarn = document.getElementById('genWarn');
const genGallery = document.getElementById('genGallery');

function containsBlocked(text){
  const lower = ' '+text.toLowerCase()+' ';
  return BLOCKED_WORDS.find(w => lower.includes(' '+w+' ') || lower.includes(' '+w+'s '));
}

async function generateNatureImage(){
  const raw = genPrompt.value.trim();
  genWarn.textContent = '';
  if(!raw){
    genWarn.textContent = 'Pehle ek nature scene describe karo — jaise "foggy valley at dawn".';
    return;
  }
  const hit = containsBlocked(raw);
  if(hit){
    genWarn.textContent = `"${hit}" allowed nahi — sirf nature/landscape describe karo, koi living being nahi.`;
    return;
  }
  const finalPrompt = `${raw}, pure nature landscape, no humans, no animals, no living creatures, serene, high detail, photographic`;
  const seed = Math.floor(Math.random()*1e9);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=768&height=768&seed=${seed}&nologo=true`;

  const card = document.createElement('div');
  card.className = 'gen-card loading';
  genGallery.prepend(card);

  genBtn.disabled = true;
  genBtn.textContent = 'Generating…';

  const img = new Image();
  img.onload = ()=>{
    card.classList.remove('loading');
    card.appendChild(img);
    const dl = document.createElement('a');
    dl.className='dl'; dl.href=url; dl.download='nature.jpg'; dl.target='_blank';
    dl.textContent='SAVE';
    card.appendChild(dl);
    genBtn.disabled = false;
    genBtn.textContent = 'Generate';
  };
  img.onerror = ()=>{
    card.remove();
    genWarn.textContent = 'Image generate nahi ho paayi — dobara try karo.';
    genBtn.disabled = false;
    genBtn.textContent = 'Generate';
  };
  img.src = url;
}

genBtn.addEventListener('click', generateNatureImage);
genPrompt.addEventListener('keydown', e=>{ if(e.key==='Enter') generateNatureImage(); });

/* ---------------- Boot ---------------- */
stage.dataset.scene = state.scene;
document.body.dataset.theme = state.theme;
tick();
