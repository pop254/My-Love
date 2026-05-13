
const PASSWORD = "IMISSYOU"; // ← change this

const SCRATCH_PHOTOS = [
  "https://sexpositions.club/wp-content/uploads/2019/06/15_23.png",
  "https://sexpositions.club/wp-content/uploads/2019/06/15_3.png",
  "https://sexpositions.club/wp-content/uploads/2016/03/3_8.png",
  "https://sexpositions.club/wp-content/uploads/2019/06/18_73.png",
  "https://sexpositions.club/wp-content/uploads/2016/04/8_29_3.png",
  "https://sexpositions.club/wp-content/uploads/2019/06/3_51_9.png",
  "https://sexpositions.club/wp-content/uploads/2016/04/12_21_4.png",
  "https://sexpositions.club/wp-content/uploads/2016/02/10_1.png",
];

const WORD_MESSAGES = [
  "Kiss your favourite part of my body",
  "Seductively eat a banana record and send it to me",
  "striptease for me in a video and send it to me",
  "touch yourself for 3 minutes and send it to me",
  "dance naked for 1 minute and send it to me",
  "lick my nipples for 2 minutes",
  "moan while calling my name in a voice note and send it to me",
  "seduce me and fuck me until i can't take it anymore",
  "lick me and for 2 minutes",
  "french kiss me for 5 minutes",
  "tell me a secret no one knows",
  "call anyone and tell them you love me",
];

const SCRATCH_ICONS = ["💖","💖","💖","💖","💖","💖"];
const WORD_ICONS    = ["💌","💌","💌","💌","💌","💌","💌","💌","💌","💌","💌","💌"];

// Background particles
const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");
let particles = [];

function resizeBg() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
resizeBg();
window.addEventListener("resize", resizeBg);

function createParticle() {
  return {
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.5 - 0.2,
    alpha: Math.random() * 0.5 + 0.1,
    heart: Math.random() > 0.7,
  };
}
for (let i = 0; i < 80; i++) particles.push(createParticle());

function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -20) { particles[i] = createParticle(); particles[i].y = bgCanvas.height + 10; }
    if (p.heart) {
      bgCtx.save();
      bgCtx.globalAlpha = p.alpha * 0.6;
      bgCtx.fillStyle = "#e8587a";
      bgCtx.font = `${p.r * 8}px serif`;
      bgCtx.fillText("♥", p.x, p.y);
      bgCtx.restore();
    } else {
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(232,88,122,${p.alpha})`;
      bgCtx.fill();
    }
  });
  requestAnimationFrame(animateBg);
}
animateBg();

// Password check
function checkPassword() {
  const val = document.getElementById("pw-input").value.trim().toLowerCase();
  const err = document.getElementById("gate-error");
  const card = document.querySelector(".gate-card");
  if (val === PASSWORD.toLowerCase()) {
    document.getElementById("gate").classList.add("hidden");
    document.getElementById("main").classList.add("visible");
    buildSite();
  } else {
    err.classList.add("show");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    setTimeout(() => err.classList.remove("show"), 2500);
    document.getElementById("pw-input").value = "";
  }
}
document.getElementById("pw-input").addEventListener("keydown", e => {
  if (e.key === "Enter") checkPassword();
});

// Floating hearts
function spawnHeart(x, y) {
  const el = document.createElement("div");
  el.className = "heart-float";
  el.textContent = ["💖","💕","🌹","✦","💗","♡"][Math.floor(Math.random()*6)];
  el.style.left = (x - 10) + "px";
  el.style.top  = (y - 10) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// Scratch cards
function buildScratchCard(src, icon) {
  const wrap = document.createElement("div");
  wrap.className = "scratch-card";

  const img = document.createElement("img");
  img.src = src;
  img.alt = "memory";
  wrap.appendChild(img);

  const canvas = document.createElement("canvas");
  wrap.appendChild(canvas);

  const resizeCanvas = () => {
    const rect = wrap.getBoundingClientRect();
    canvas.width  = rect.width  || 180;
    canvas.height = rect.height || 180;
    drawScratchLayer(canvas, icon);
  };
  img.onload = resizeCanvas;
  setTimeout(resizeCanvas, 100);

  let scratching = false;

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }

  function scratch(e) {
    if (!scratching) return;
    const { x, y } = pos(e);
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    const cx = e.clientX || (e.touches && e.touches[0].clientX) || x;
    const cy = e.clientY || (e.touches && e.touches[0].clientY) || y;
    spawnHeart(cx, cy);
    checkReveal(canvas, wrap);
  }

  canvas.addEventListener("mousedown",  e => { scratching = true; scratch(e); });
  canvas.addEventListener("mousemove",  scratch);
  canvas.addEventListener("mouseup",    () => scratching = false);
  canvas.addEventListener("touchstart", e => { e.preventDefault(); scratching = true; scratch(e); }, { passive: false });
  canvas.addEventListener("touchmove",  e => { e.preventDefault(); scratch(e); }, { passive: false });
  canvas.addEventListener("touchend",   () => scratching = false);

  return wrap;
}

function drawScratchLayer(canvas, icon) {
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "source-over";
  const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 10, canvas.width/2, canvas.height/2, canvas.width/2);
  grad.addColorStop(0,   "#8b3a6b");
  grad.addColorStop(0.5, "#c2185b");
  grad.addColorStop(1,   "#e8587a");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, Math.PI*2);
  ctx.fill();
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*3+1, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.08})`;
    ctx.fill();
  }
  ctx.font = `${canvas.width * 0.3}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = 0.6;
  ctx.fillText(icon, canvas.width/2, canvas.height/2);
  ctx.globalAlpha = 1;
  ctx.font = `${canvas.width * 0.1}px 'Dancing Script', cursive`;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("scratch me ✦", canvas.width/2, canvas.height * 0.82);
}

function checkReveal(canvas, wrap) {

  const ctx = canvas.getContext("2d");

  const data = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  ).data;

  let transparent = 0;

  for(let i = 3; i < data.length; i += 4){

    if(data[i] < 50){
      transparent++;
    }

  }

  // ONLY REVEAL
  if(transparent / (data.length / 4) > 0.55){

    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 0.5s";

    wrap.classList.add("scratch-revealed");

  }

}


// Word cards
function buildWordCard(text, icon) {

  const wrap = document.createElement("div");
  wrap.className = "word-card-wrap";

  const card = document.createElement("div");
  card.className = "word-card";

  const front = document.createElement("div");
  front.className = "word-front";

  front.innerHTML = `
    <span class="word-front-icon">${icon}</span>
    <span class="word-front-hint">tap to reveal</span>
  `;

  const back = document.createElement("div");
  back.className = "word-back";

  back.innerHTML = `
    <p class="word-text">${text}</p>
  `;

  card.appendChild(front);
  card.appendChild(back);

  wrap.appendChild(card);

  let flipped = false;

  wrap.addEventListener("click", e => {

    spawnHeart(e.clientX, e.clientY);

    if(!flipped){

      // OPEN CARD
      flipped = true;
      card.classList.add("flipped");

    } else {

      // CLOSE CARD
      flipped = false;
      card.classList.remove("flipped");

      // SHUFFLE AFTER CLOSE
      setTimeout(() => {
        triggerShuffle("word");
      }, 500);

    }

  });

  return wrap;
}

// Shuffle
function triggerShuffle(type) {
  const grid = document.getElementById(type === "word" ? "word-grid" : "scratch-grid");
  const items = Array.from(grid.children);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    grid.appendChild(items[j]);
    [items[i], items[j]] = [items[j], items[i]];
  }
  items.forEach((el, i) => {
    el.style.setProperty("--sx", ((Math.random()-0.5)*60) + "px");
    el.style.setProperty("--sy", ((Math.random()-0.5)*40) + "px");
    el.style.setProperty("--sr", ((Math.random()-0.5)*12) + "deg");
    el.style.animationDelay = (i * 0.04) + "s";
    el.classList.remove("shuffling");
    void el.offsetWidth;
    el.classList.add("shuffling");
  });
  setTimeout(() => items.forEach(el => el.classList.remove("shuffling")), 1200);
}

// Build site
function buildSite() {
  const sg = document.getElementById("scratch-grid");
  SCRATCH_PHOTOS.forEach((src, i) => sg.appendChild(buildScratchCard(src, SCRATCH_ICONS[i % SCRATCH_ICONS.length])));
  const wg = document.getElementById("word-grid");
  WORD_MESSAGES.forEach((msg, i) => wg.appendChild(buildWordCard(msg, WORD_ICONS[i % WORD_ICONS.length])));
}

// Click hearts
document.addEventListener("click", e => {
  if (document.getElementById("gate").classList.contains("hidden")) spawnHeart(e.clientX, e.clientY);
});
// RESTORE MEMORIES

document.addEventListener("click", e => {

  if(e.target.id === "restoreBtn"){

    const cards = document.querySelectorAll(".scratch-card");

    cards.forEach((card, index) => {

      const canvas = card.querySelector("canvas");

      canvas.style.opacity = "1";

      drawScratchLayer(
        canvas,
        SCRATCH_ICONS[index % SCRATCH_ICONS.length]
      );

      card.classList.remove("scratch-revealed");

    });

    // SHUFFLE AFTER RESTORE
    setTimeout(() => {

      triggerShuffle("scratch");

    }, 500);

  }

});
