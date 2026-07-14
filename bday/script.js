/* =========================================
   BIRTHDAY CARD — SCRIPT.JS — Bhavs Edition
   ========================================= */

/* =========================================
   CONFETTI ENGINE
   ========================================= */
const canvas = document.getElementById('confetti-canvas');
const ctx    = canvas.getContext('2d');
let confettiParticles = [];
let confettiRunning   = false;
let confettiFrame     = null;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const CONFETTI_COLORS = [
  '#f06292','#e91e8c','#ce93d8','#ba68c8','#9c27b0',
  '#ffd700','#ff69b4','#b57bee','#ff4da6','#e040fb',
  '#fff','#f8bbd0','#e1bee7',
];

class ConfettiParticle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x        = Math.random() * canvas.width;
    this.y        = initial ? -Math.random() * canvas.height : -20;
    this.size     = Math.random() * 9 + 4;
    this.color    = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    this.shape    = ['circle','rect','triangle','star'][Math.floor(Math.random() * 4)];
    this.speedY   = Math.random() * 3.5 + 1.5;
    this.speedX   = (Math.random() - 0.5) * 2.5;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.12;
    this.opacity  = Math.random() * 0.6 + 0.4;
    this.wobble   = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.06 + 0.02;
  }
  update() {
    this.y        += this.speedY;
    this.x        += this.speedX + Math.sin(this.wobble) * 0.8;
    this.rotation += this.rotSpeed;
    this.wobble   += this.wobbleSpeed;
    if (this.y > canvas.height + 30) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    switch (this.shape) {
      case 'circle':
        ctx.beginPath(); ctx.arc(0,0,this.size/2,0,Math.PI*2); ctx.fill(); break;
      case 'rect':
        ctx.fillRect(-this.size/2,-this.size/4,this.size,this.size/2); break;
      case 'triangle':
        ctx.beginPath(); ctx.moveTo(0,-this.size/2);
        ctx.lineTo(this.size/2,this.size/2); ctx.lineTo(-this.size/2,this.size/2);
        ctx.closePath(); ctx.fill(); break;
      case 'star':
        drawStar(ctx,0,0,5,this.size/2,this.size/4); break;
    }
    ctx.restore();
  }
}

function drawStar(ctx,cx,cy,spikes,outerR,innerR) {
  let rot = Math.PI/2*3;
  const step = Math.PI/spikes;
  ctx.beginPath(); ctx.moveTo(cx,cy-outerR);
  for (let i=0;i<spikes;i++) {
    ctx.lineTo(cx+Math.cos(rot)*outerR, cy+Math.sin(rot)*outerR); rot+=step;
    ctx.lineTo(cx+Math.cos(rot)*innerR, cy+Math.sin(rot)*innerR); rot+=step;
  }
  ctx.lineTo(cx,cy-outerR); ctx.closePath(); ctx.fill();
}

function spawnConfetti(count=200) {
  for (let i=0;i<count;i++) {
    const p=new ConfettiParticle(); p.y=Math.random()*-200; confettiParticles.push(p);
  }
}
function animateConfetti() {
  if (!confettiRunning) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confettiParticles.forEach(p=>{ p.update(); p.draw(); });
  confettiFrame = requestAnimationFrame(animateConfetti);
}
function startConfetti() {
  if (confettiRunning) return;
  confettiRunning = true; confettiParticles = [];
  spawnConfetti(260); animateConfetti();
  setTimeout(stopConfetti, 6000);
}
function stopConfetti() {
  confettiRunning = false; cancelAnimationFrame(confettiFrame);
  let fade = 1;
  const out = setInterval(()=>{
    fade -= 0.05;
    if (fade <= 0) { ctx.clearRect(0,0,canvas.width,canvas.height); clearInterval(out); return; }
    ctx.globalAlpha = fade;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confettiParticles.forEach(p=>p.draw());
  }, 60);
}

/* =========================================
   FLOATING HEARTS
   ========================================= */
const heartsContainer = document.getElementById('floating-hearts');
const HEART_EMOJIS = ['💜', '💖', '💕', '💗', '💓', '🌸', '✨', '💝', '🌼'];
function createFloatingHeart() {
  const el = document.createElement('span');
  el.className = 'floating-heart';
  el.textContent = HEART_EMOJIS[Math.floor(Math.random()*HEART_EMOJIS.length)];
  el.style.left = Math.random()*100+'vw';
  el.style.fontSize = (Math.random()*1.4+0.8)+'rem';
  const dur = Math.random()*10+8;
  el.style.animationDuration = dur+'s';
  el.style.animationDelay = Math.random()*5+'s';
  heartsContainer.appendChild(el);
  setTimeout(()=>el.remove(),(dur+6)*1000);
}
(function heartLoop() { createFloatingHeart(); setTimeout(heartLoop,Math.random()*1200+600); })();

/* =========================================
   BALLOONS — starts after page glow, dynamic sway
   ========================================= */
const balloonsContainer = document.getElementById('balloons-container');

const BALLOON_PALETTES = [
  ['#ff69b4','#e91e8c'],  // hot pink
  ['#ce93d8','#9c27b0'],  // purple
  ['#f48fb1','#c2185b'],  // rose
  ['#ea80fc','#aa00ff'],  // violet
  ['#ffd6e0','#e91e8c'],  // blush
  ['#ff4fa0','#7b1fa2'],  // magenta
  ['#f3e5f5','#ba68c8'],  // lavender
  ['#ffc0cb','#e040fb'],  // pink-magenta
];

function createBalloon(xOverride) {
  const el   = document.createElement('div');
  el.className = 'balloon';

  const [c1, c2] = BALLOON_PALETTES[Math.floor(Math.random() * BALLOON_PALETTES.length)];
  const size     = Math.floor(Math.random() * 28 + 38); // 38–66 px
  const dur      = (Math.random() * 8 + 13).toFixed(1);  // 13–21s
  const delay    = (Math.random() * 3).toFixed(2);        // 0–3s stagger
  const swR      = Math.floor(Math.random() * 28 + 14);   // sway right 14–42 px
  const swL      = Math.floor(Math.random() * 28 + 14);   // sway left
  const xPos     = xOverride !== undefined ? xOverride : Math.random() * 96 + 2;

  const body = document.createElement('div');
  body.className = 'balloon-body';
  body.style.background = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;

  const str = document.createElement('div');
  str.className = 'balloon-string';
  str.style.setProperty('--dur', dur + 's');

  el.appendChild(body);
  el.appendChild(str);

  el.style.left             = xPos + 'vw';
  el.style.setProperty('--dur',  dur  + 's');
  el.style.setProperty('--sz',   size + 'px');
  el.style.setProperty('--sw-r', swR  + 'px');
  el.style.setProperty('--sw-l', '-'  + swL + 'px');
  el.style.animationDelay   = delay + 's';
  el.style.transform        = `scale(${(Math.random() * 0.3 + 0.85).toFixed(2)})`;

  balloonsContainer.appendChild(el);
  setTimeout(()=>el.remove(),(dur+delay+2)*1000);
}
/* Continuous spawn loop */
function balloonLoop() {
  createBalloon();
  setTimeout(balloonLoop, Math.random() * 2000 + 1200);
}

/* =========================================
   MUSIC PLAYER — Prema Velluva | HIT 3
   YouTube IFrame API
   ========================================= */
const musicBtn        = document.getElementById('music-btn');
const musicIcon       = document.getElementById('music-icon');
const musicLabel      = document.getElementById('music-label');
const musicVisualizer = document.getElementById('music-visualizer');

let ytPlayer      = null;
let musicPlaying  = false;
let ytReady       = false;
let timeMonitorInterval = null;

function startTimeMonitor() {
  if (timeMonitorInterval) clearInterval(timeMonitorInterval);
  timeMonitorInterval = setInterval(() => {
    if (!ytPlayer || !ytReady) return;
    try {
      const currentTime = ytPlayer.getCurrentTime();
      if (currentTime >= 130) {
        ytPlayer.seekTo(20, true);
      } else if (currentTime < 20) {
        ytPlayer.seekTo(20, true);
      }
    } catch (e) {
      console.error(e);
    }
  }, 200);
}

function stopTimeMonitor() {
  if (timeMonitorInterval) {
    clearInterval(timeMonitorInterval);
    timeMonitorInterval = null;
  }
}

// YouTube IFrame API callback — called automatically when API loads
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('yt-player', {
    videoId: 'SuLeNL9w-Os', // Prema Velluva — HIT 3 (YouTube Link)
    playerVars: {
      autoplay:       1,   // start playing immediately
      mute:           1,   // start muted (required for autoplay in browsers)
      controls:       0,
      loop:           1,
      playlist:       'SuLeNL9w-Os',
      rel:            0,
      modestbranding: 1,
      playsinline:    1,
      enablejsapi:    1,
      start:          20,  // start at 20 seconds
    },
    events: {
      onReady: (event) => {
        ytReady = true;
        event.target.seekTo(20, true);
        event.target.playVideo();

        // Small delay, then unmute so autoplay works if browser allows
        setTimeout(() => {
          if (ytPlayer && ytReady) {
            ytPlayer.unMute();
            ytPlayer.setVolume(80);
            ytPlayer.playVideo();
          }
        }, 1500);

        // Interaction helper to unmute and play once user clicks, touches, moves mouse, scrolls, or presses keys
        const enableAutoplay = () => {
          if (ytPlayer && ytReady) {
            ytPlayer.unMute();
            ytPlayer.setVolume(80);
            ytPlayer.playVideo();
          }
          // Remove listeners once active
          ['click', 'touchstart', 'mousemove', 'scroll', 'keydown'].forEach(evt => {
            document.removeEventListener(evt, enableAutoplay);
          });
        };
        ['click', 'touchstart', 'mousemove', 'scroll', 'keydown'].forEach(evt => {
          document.addEventListener(evt, enableAutoplay);
        });
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) {
          startTimeMonitor();
          musicVisualizer.classList.add('active');
          musicIcon.classList.add('playing');
          musicIcon.textContent  = '🎶';
          musicLabel.textContent = 'Pause';
          musicPlaying = true;
        } else if (
          e.data === YT.PlayerState.PAUSED ||
          e.data === YT.PlayerState.ENDED
        ) {
          stopTimeMonitor();
          musicVisualizer.classList.remove('active');
          musicIcon.classList.remove('playing');
          musicIcon.textContent  = '🎵';
          musicLabel.textContent = 'Play Music';
          musicPlaying = false;
          
          if (e.data === YT.PlayerState.ENDED) {
            // Seek and repeat if absolute end is reached
            ytPlayer.seekTo(20, true);
            ytPlayer.playVideo();
          }
        }
      },
    },
  });
};

function toggleMusic() {
  if (!ytReady || !ytPlayer) return;
  if (musicPlaying) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.setVolume(85);
    const currentTime = ytPlayer.getCurrentTime();
    if (currentTime < 20 || currentTime >= 130) {
      ytPlayer.seekTo(20, true);
    }
    ytPlayer.playVideo();
  }
}

musicBtn.addEventListener('click', toggleMusic);

/* =========================================
   🎂 CAKE — 3-STAGE SEQUENCE
   Stage 1 : Candles lit & flickering
   Stage 2 : 💨 Blow → shake + staggered flame-out + smoke puffs
   Stage 3 : 🌠 Make a Wish → confetti + modal
   ========================================= */
let cakeStage = 'lit';

const blowBtn    = document.getElementById('blow-btn');
const wishBtn    = document.getElementById('wish-btn');
const stageHint  = document.getElementById('stage-hint');
const flameGlow  = document.getElementById('flame-glow-ambient');
const flameWraps = [1,2,3].map(n=>document.getElementById(`flame-wrap-${n}`));
const smokeWraps = [1,2,3].map(n=>document.getElementById(`smoke-wrap-${n}`));

/* Spawn rising smoke puffs */
function spawnSmoke(container) {
  container.classList.add('active');
  for (let pass=0; pass<3; pass++) {
    setTimeout(()=>{
      for (let p=0; p<5; p++) {
        setTimeout(()=>{
          const puff=document.createElement('div');
          puff.className='smoke-puff';
          const size=Math.random()*9+7;
          const sx=(Math.random()-0.5)*14;
          const dur=(1.3+Math.random()*.9)+'s';
          puff.style.cssText=`width:${size}px;height:${size}px;left:${Math.random()*12-4}px;top:${-Math.random()*4}px;--sx:${sx}px;--dur:${dur};animation-delay:${Math.random()*.2}s;`;
          container.appendChild(puff);
          setTimeout(()=>puff.remove(), 2800);
        }, p*140);
      }
    }, pass*480);
  }
}

/* Screen shake on blow */
function shakeCake() {
  const scene = document.getElementById('cake-scene');
  [[-7,0],[7,0],[-5,-2],[5,2],[-3,0],[3,0],[0,0]].forEach(([x,y],i) => {
    setTimeout(() => { scene.style.transform = `translate(${x}px,${y}px)`; }, i * 55);
  });
  setTimeout(() => { scene.style.transform = ''; }, 7 * 55 + 80);
}

function blowCandles() {
  if (cakeStage !== 'lit') return;
  cakeStage = 'blowing';
  blowBtn.disabled = true;
  blowBtn.textContent = '💨 Blowing…';

  shakeCake();

  flameWraps.forEach((fw, i) => {
    setTimeout(() => {
      fw.classList.add('blown');
      spawnSmoke(smokeWraps[i]);

      if (i === flameWraps.length - 1) {
        cakeStage = 'blown';
        flameGlow.classList.add('out');

        setTimeout(() => {
          stageHint.textContent = '✨ Now close your eyes and make a wish…';
          stageHint.style.color = 'var(--pink-300)';
        }, 350);

        setTimeout(() => {
          // Slide out blow button
          blowBtn.style.transition = 'opacity .45s ease, transform .45s ease';
          blowBtn.style.opacity    = '0';
          blowBtn.style.transform  = 'translateY(16px) scale(.9)';

          setTimeout(() => {
            blowBtn.style.display = 'none';
            // Reveal wish button
            wishBtn.style.display     = 'flex';
            wishBtn.style.transition  = 'opacity .55s ease, transform .55s cubic-bezier(.34,1.56,.64,1)';
            requestAnimationFrame(() => requestAnimationFrame(() => {
              wishBtn.style.opacity   = '1';
              wishBtn.style.transform = 'translateY(0)';
              cakeStage = 'wish';
            }));
          }, 460);
        }, 850);
      }
    }, i * 300);
  });
}

blowBtn.addEventListener('click', blowCandles);

/* =========================================
   WISH MODAL
   ========================================= */
const wishModal         = document.getElementById('wish-modal');
const wishModalClose    = document.getElementById('wish-modal-close');
const wishModalBackdrop = document.getElementById('wish-modal-backdrop');

function openWishModal()  {
  wishModal.classList.add('active');
  wishModalBackdrop.classList.add('active');
  startConfetti();
  document.body.style.overflow='hidden';
}
function closeWishModal() {
  wishModal.classList.remove('active');
  wishModalBackdrop.classList.remove('active');
  document.body.style.overflow='';
}

wishBtn.addEventListener('click', openWishModal);
wishModalClose.addEventListener('click', ()=>{ closeWishModal(); setTimeout(startConfetti,300); });
wishModalBackdrop.addEventListener('click', closeWishModal);
document.addEventListener('keydown', e=>{ if(e.key==='Escape'&&wishModal.classList.contains('active')) closeWishModal(); });

/* =========================================
   PHOTO UPLOAD — click 📷 to replace photo
   ========================================= */
document.querySelectorAll('.upload-input').forEach(input => {
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const targetId = e.target.dataset.target;
    const item     = document.getElementById(targetId);
    const img      = item.querySelector('.gallery-img');
    const reader   = new FileReader();
    reader.onload  = ev => {
      img.style.transition = 'opacity .35s ease';
      img.style.opacity    = '0';
      setTimeout(() => {
        img.src = ev.target.result;
        img.style.opacity = '1';
      }, 350);
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  });
});

/* =========================================
   SCROLL REVEAL
   ========================================= */
const revealEls = document.querySelectorAll(
  '.message-card,.gallery-item,.reason-card,.section-header,.gallery-subtitle,.gallery-note'
);
revealEls.forEach((el,i)=>{
  el.classList.add('reveal');
  if (el.classList.contains('gallery-item')||el.classList.contains('reason-card'))
    el.classList.add(`reveal-delay-${(i%6)+1}`);
});
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: .12 });
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* =========================================
   MOUSE PARALLAX on orbs
   ========================================= */
document.addEventListener('mousemove', e=>{
  const xR=e.clientX/window.innerWidth-.5, yR=e.clientY/window.innerHeight-.5;
  document.querySelectorAll('.orb').forEach((orb,i)=>{
    const f=(i+1)*14;
    orb.style.transform=`translate(${xR*f}px,${yR*f}px)`;
  });
});

/* =========================================
   GALLERY SPARKLE ON HOVER
   ========================================= */
const sparkleCSS = document.createElement('style');
sparkleCSS.textContent=`@keyframes sparkleGallery{0%{transform:scale(0) rotate(0deg);opacity:1}60%{transform:scale(1.4) rotate(20deg);opacity:1}100%{transform:scale(.8) rotate(40deg);opacity:0}}`;
document.head.appendChild(sparkleCSS);

document.querySelectorAll('.gallery-item').forEach(item=>{
  item.addEventListener('mouseenter',()=>{
    const sp=document.createElement('span');
    sp.textContent=['✨','💜','🌸','💖'][Math.floor(Math.random()*4)];
    sp.style.cssText=`position:absolute;top:${Math.random()*80+10}%;left:${Math.random()*80+10}%;font-size:1.5rem;pointer-events:none;z-index:10;animation:sparkleGallery 1s ease forwards;`;
    item.appendChild(sp);
    setTimeout(()=>sp.remove(),1000);
  });
});

/* =========================================
   WELCOME CONFETTI BURST on load
   ========================================= */
window.addEventListener('load', () => {
  // Confetti welcome burst at 1.4s
  setTimeout(() => {
    spawnConfetti(80);
    confettiRunning = true; animateConfetti();
    setTimeout(stopConfetti, 4000);
  }, 1400);

  // Balloons start at 2.5s — AFTER the glow + cake entrance animation
  setTimeout(() => {
    // Initial burst: 6 balloons evenly spread across the screen
    [5, 18, 34, 52, 68, 84].forEach((xPos, i) => {
      setTimeout(() => createBalloon(xPos), i * 320);
    });
    // Then continuous loop begins
    setTimeout(balloonLoop, 2400);
  }, 2500);
});

/* =========================================
   CUSTOM CURSOR GLOW (desktop)
   ========================================= */
if (window.matchMedia('(hover:hover)').matches) {
  const cur=document.createElement('div');
  cur.style.cssText='position:fixed;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle,rgba(233,30,140,.5),transparent 70%);pointer-events:none;z-index:9999;mix-blend-mode:screen;transform:translate(-50%,-50%);';
  document.body.appendChild(cur);
  window.addEventListener('mousemove',e=>{ cur.style.left=e.clientX+'px'; cur.style.top=e.clientY+'px'; });
}
