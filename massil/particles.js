/* ================================================
   MASSIL — particles.js
   Canvas particle system for hero section
   ================================================ */
(function(){
  const canvas = document.getElementById('particles-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  let particles = [];
  let rafId = null;
  let active = false;

  const COLORS = [
    'rgba(82,183,136,0.55)',
    'rgba(149,213,178,0.45)',
    'rgba(253,246,236,0.35)',
    'rgba(212,175,55,0.3)',
    'rgba(82,183,136,0.3)',
  ];

  function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
  }

  function random(min,max){ return Math.random()*(max-min)+min; }

  function createParticle(){
    const size = random(1.5,5);
    return {
      x:     random(0,W),
      y:     random(H*0.1, H),
      size:  size,
      baseSize: size,
      vx:    random(-0.3,0.3),
      vy:    random(-0.6,-0.15),
      opacity: random(0.2,0.7),
      color: COLORS[Math.floor(random(0,COLORS.length))],
      life:  0,
      maxLife: random(200,500),
      pulse: random(0,Math.PI*2),
      pulseSpeed: random(0.01,0.025)
    };
  }

  function initParticles(){
    particles = [];
    const count = Math.min(45, Math.floor(W/30));
    for(let i=0;i<count;i++){
      const p = createParticle();
      p.life = random(0, p.maxLife); // stagger start
      particles.push(p);
    }
  }

  function drawParticle(p){
    const lifeRatio = p.life / p.maxLife;
    let alpha = p.opacity;
    if(lifeRatio < 0.1) alpha *= lifeRatio/0.1;
    if(lifeRatio > 0.8) alpha *= (1-lifeRatio)/0.2;

    const pulse = Math.sin(p.pulse) * 0.3 + 1;
    const size = p.baseSize * pulse;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI*2);
    ctx.fill();

    // Subtle glow for larger particles
    if(p.baseSize > 3){
      ctx.globalAlpha = alpha * 0.3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    ctx.restore();
  }

  function update(){
    particles.forEach((p,i)=>{
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.pulse += p.pulseSpeed;

      // Gentle horizontal drift
      p.vx += random(-0.01,0.01);
      p.vx = Math.max(-0.5, Math.min(0.5, p.vx));

      if(p.life >= p.maxLife || p.y < -10){
        particles[i] = createParticle();
        particles[i].y = H + 5;
        particles[i].life = 0;
      }
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    if(!active) return;
    particles.forEach(drawParticle);
    update();
    rafId = requestAnimationFrame(draw);
  }

  function start(){
    if(active) return;
    active = true;
    canvas.classList.add('hero-active');
    if(!rafId) draw();
  }

  function stop(){
    active = false;
    canvas.classList.remove('hero-active');
    if(rafId){ cancelAnimationFrame(rafId); rafId=null; }
    ctx.clearRect(0,0,W,H);
  }

  // Init
  resize();
  initParticles();

  window.addEventListener('resize',()=>{
    resize();
    initParticles();
  });

  // Auto-start after page load
  window.addEventListener('load',()=>{
    setTimeout(start, 800);
  });

  // Pause when page is not visible (performance)
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) stop();
    else if(window.scrollY < window.innerHeight) start();
  });

  // Expose control
  window.MassilParticles = { start, stop };
})();
