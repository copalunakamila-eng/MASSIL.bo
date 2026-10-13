/* ================================================
   MASSIL — hero.js
   Hero parallax, mouse interaction, animations
   ================================================ */
(function(){
  const hero = document.querySelector('.hero');
  if(!hero) return;

  const heroBg      = hero.querySelector('.hero-bg');
  const heroGradient= hero.querySelector('.hero-gradient');
  const bottleWrap  = hero.querySelector('.bottle-wrap');
  const heroDecos   = hero.querySelectorAll('.hero-deco');

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let scrollY = 0;
  let ticking = false;

  /* ---- MOUSE PARALLAX ---- */
  function onMouseMove(e){
    const rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left - rect.width/2)  / rect.width;
    mouseY = (e.clientY - rect.top  - rect.height/2) / rect.height;
  }

  function lerp(a,b,t){ return a + (b-a)*t; }

  function animateParallax(){
    targetX = lerp(targetX, mouseX, 0.06);
    targetY = lerp(targetY, mouseY, 0.06);

    // Background moves subtly opposite
    if(heroBg){
      heroBg.style.transform =
        `translate(${targetX*-12}px, ${targetY*-8}px)`;
    }
    // Bottle follows slightly
    if(bottleWrap){
      bottleWrap.style.transform =
        `translate(${targetX*8}px, ${targetY*6}px)`;
    }
    // Decorative elements move more
    heroDecos.forEach((el, i)=>{
      const depth = (i%3+1) * 6;
      el.style.transform =
        `translate(${targetX*depth}px, ${targetY*(depth*0.7)}px)`;
    });

    requestAnimationFrame(animateParallax);
  }

  hero.addEventListener('mousemove', onMouseMove, {passive:true});
  animateParallax();

  /* ---- SCROLL PARALLAX (hero bg) ---- */
  function onScroll(){
    scrollY = window.scrollY;
    if(!ticking){
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }

  function updateScroll(){
    const progress = scrollY / window.innerHeight;

    // Fade out hero content on scroll
    const heroInner = hero.querySelector('.hero-inner');
    if(heroInner){
      heroInner.style.transform = `translateY(${scrollY*0.35}px)`;
      heroInner.style.opacity   = Math.max(0, 1 - progress*2);
    }

    // Parallax the hero background
    if(heroBg){
      heroBg.style.transform += ` translateY(${scrollY*0.2}px)`;
    }

    // Particles: stop when not in hero view
    if(window.MassilParticles){
      if(scrollY > window.innerHeight){
        window.MassilParticles.stop();
      } else {
        window.MassilParticles.start();
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', onScroll, {passive:true});

  /* ---- TYPING EFFECT for hero badge ---- */
  function typeEffect(el, text, speed=60){
    el.textContent = '';
    let i = 0;
    const interval = setInterval(()=>{
      el.textContent += text[i];
      i++;
      if(i >= text.length) clearInterval(interval);
    }, speed);
  }

  /* ---- HERO BADGE ANIMATION ---- */
  const badge = hero.querySelector('.hero-badge');
  if(badge){
    const badgeText = badge.getAttribute('data-text') || badge.textContent;
    setTimeout(()=>{
      typeEffect(badge, badgeText, 50);
    }, 500);
  }

  /* ---- SCROLL INDICATOR HIDE on scroll ---- */
  const scrollHint = hero.querySelector('.scroll-hint');
  if(scrollHint){
    window.addEventListener('scroll',()=>{
      scrollHint.style.opacity = scrollY > 80 ? '0' : '';
    },{passive:true});
  }

})();
