/* ================================================
   MASSIL — main.js
   Core interactions: scroll reveal, navbar,
   timeline, filters, form, counters, ripple
   ================================================ */

/* ---- UTILITIES ---- */
function $(sel, ctx){ return (ctx||document).querySelector(sel); }
function $$(sel, ctx){ return [...(ctx||document).querySelectorAll(sel)]; }

/* ================================================
   1. NAVBAR — scroll + mobile toggle
   ================================================ */
(function(){
  const nav     = $('#navbar');
  const burger  = $('.hamburger');
  const mobileNav = $('.mobile-nav');
  const overlay = $('.nav-overlay');

  function onScroll(){
    if(window.scrollY > 75){
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  function toggleMenu(open){
    burger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if(burger) burger.addEventListener('click',()=> toggleMenu(!mobileNav.classList.contains('open')));
  if(overlay) overlay.addEventListener('click',()=> toggleMenu(false));
  $$('.mobile-nav a').forEach(a => a.addEventListener('click',()=> toggleMenu(false)));
})();

/* ================================================
   2. SMOOTH SCROLL for anchor links
   ================================================ */
document.addEventListener('click', e=>{
  const anchor = e.target.closest('a[href^="#"]');
  if(!anchor) return;
  const id = anchor.getAttribute('href');
  const el = document.querySelector(id);
  if(!el) return;
  e.preventDefault();
  const top = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({top, behavior:'smooth'});
});

/* ================================================
   3. INTERSECTION OBSERVER — scroll reveal
   ================================================ */
(function(){
  const classes = ['.reveal','.reveal-left','.reveal-right','.reveal-scale','.reveal-rotate'];
  const elements = $$(classes.join(','));

  if(!elements.length) return;

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.12, rootMargin:'0px 0px -30px 0px'});

  elements.forEach(el => obs.observe(el));
})();

/* ================================================
   4. PROCESO TIMELINE — animated step-by-step
   ================================================ */
(function(){
  const pasos = $$('.paso');
  if(!pasos.length) return;

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const paso = entry.target;
        const delay = parseInt(paso.dataset.delay||0);
        setTimeout(()=>{
          paso.classList.add('animate');
          paso.querySelector('.paso-icon').style.opacity='1';
        }, delay);
        obs.unobserve(paso);
      }
    });
  },{threshold:0.4});

  pasos.forEach((p,i)=>{
    p.dataset.delay = i*160;
    p.querySelector('.paso-icon').style.opacity='0';
    obs.observe(p);
  });
})();

/* ================================================
   5. CATALOGO FILTERS
   ================================================ */
(function(){
  const filters = $$('.filter');
  const items   = $$('.cat-item');
  if(!filters.length || !items.length) return;

  filters.forEach(btn=>{
    btn.addEventListener('click',()=>{
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;

      items.forEach(item=>{
        if(cat === 'all' || item.dataset.cat === cat){
          item.style.display = '';
          setTimeout(()=>{
            item.style.opacity = '1';
            item.style.transform = '';
          },10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(()=> item.style.display='none', 350);
        }
      });
    });
  });
})();

/* ================================================
   6. ANIMATED COUNTERS
   ================================================ */
(function(){
  const counters = $$('[data-count]');
  if(!counters.length) return;

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1800;
        const step = 16;
        const increment = target / (duration/step);
        let current = 0;

        const timer = setInterval(()=>{
          current = Math.min(current+increment, target);
          el.textContent = Math.floor(current).toLocaleString();
          if(current >= target) clearInterval(timer);
        }, step);

        obs.unobserve(el);
      }
    });
  },{threshold:0.5});

  counters.forEach(el=>{ el.textContent='0'; obs.observe(el); });
})();

/* ================================================
   7. CONTACT FORM — validation + feedback
   ================================================ */
(function(){

  const form = $('#contact-form');
  const success = $('#form-success');

  if(!form) return;

  /* ---- FUNCIONES DE VALIDACIÓN ---- */

  function mostrarError(input, mensaje){
    input.style.borderColor = '#c0392b';

    let error = input.parentElement.querySelector('.form-error');

    if(!error){
      error = document.createElement('small');
      error.className = 'form-error';
      error.style.color = '#c0392b';
      error.style.display = 'block';
      error.style.marginTop = '5px';
      error.style.fontSize = '0.8rem';

      input.parentElement.appendChild(error);
    }

    error.textContent = mensaje;
  }

  function quitarError(input){
    input.style.borderColor = '';

    const error = input.parentElement.querySelector('.form-error');

    if(error){
      error.remove();
    }
  }

  /* ---- VALIDAR NOMBRE ---- */

  
function validarNombre(input){

  // Eliminar inmediatamente números y caracteres no permitidos
  input.value = input.value.replace(
    /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g,
    ''
  );

  const valor = input.value.trim();

  if(valor === ''){
    mostrarError(input, 'El nombre es obligatorio.');
    return false;
  }

  if(valor.length < 2){
    mostrarError(input, 'El nombre debe tener al menos 2 caracteres.');
    return false;
  }

  quitarError(input);
  return true;
}




  /* ---- VALIDAR TELÉFONO ---- */


function validarTelefono(input){

  // Eliminar inmediatamente todo lo que NO sea número
  input.value = input.value.replace(/[^0-9]/g, '');

  const valor = input.value.trim();

  if(valor === ''){
    mostrarError(input, 'El teléfono es obligatorio.');
    return false;
  }

  if(valor.length !== 8){
    mostrarError(input, 'El teléfono debe tener 8 números.');
    return false;
  }

  quitarError(input);
  return true;
}

  
  /* ---- VALIDAR EMAIL ---- */

  function validarEmail(input){

    const valor = input.value.trim();

    if(valor === ''){
      mostrarError(input, 'El correo electrónico es obligatorio.');
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(valor)){
      mostrarError(input, 'Ingresa un correo electrónico válido.');
      return false;
    }

    quitarError(input);
    return true;
  }

  /* ---- VALIDAR INTERÉS ---- */

  function validarInteres(input){

    if(input.value.trim() === ''){
      mostrarError(input, 'Selecciona una opción.');
      return false;
    }

    quitarError(input);
    return true;
  }

  /* ---- VALIDAR MENSAJE ---- */

  function validarMensaje(input){

    const valor = input.value.trim();

    if(valor === ''){
      mostrarError(input, 'El mensaje es obligatorio.');
      return false;
    }

    if(valor.length < 10){
      mostrarError(input, 'El mensaje debe tener al menos 10 caracteres.');
      return false;
    }

    quitarError(input);
    return true;
  }

  /* ================================================
     VALIDACIÓN AL ENVIAR
     ================================================ */

  form.addEventListener('submit', function(e){

    e.preventDefault();

    const nombre = form.querySelector('[name="nombre"]');
    const telefono = form.querySelector('[name="telefono"]');
    const email = form.querySelector('[name="email"]');
    const interes = form.querySelector('[name="interes"]');
    const mensaje = form.querySelector('[name="mensaje"]');

    let valido = true;

    if(nombre && !validarNombre(nombre)){
      valido = false;
    }

    if(telefono && !validarTelefono(telefono)){
      valido = false;
    }

    if(email && !validarEmail(email)){
      valido = false;
    }

    if(interes && !validarInteres(interes)){
      valido = false;
    }

    if(mensaje && !validarMensaje(mensaje)){
      valido = false;
    }

    // Si existe algún error, no continúa
    if(!valido){
      return;
    }

    /* ---- TODO CORRECTO ---- */

    const btn = form.querySelector('.fs');

    if(btn){
      btn.textContent = 'Enviando...';
      btn.disabled = true;
    }

    /*
       POR AHORA solo mostramos el mensaje de éxito.
       Después conectaremos esta parte con Node.js
       y SQLite para guardar los datos.
    */

    setTimeout(function(){

      form.style.display = 'none';

      if(success){

        success.style.display = 'block';

        success.innerHTML = `
          <div style="font-size:3rem;margin-bottom:1rem">
            ✅
          </div>

          <strong style="
            font-family:var(--font-h);
            font-size:1.4rem;
            display:block;
            margin-bottom:.5rem
          ">
            ¡Mensaje enviado!
          </strong>

          <p style="font-size:.9rem;opacity:.7">
            Nos pondremos en contacto contigo pronto.
          </p>
        `;

      }

    }, 1000);

  });

  /* ================================================
     VALIDACIÓN EN TIEMPO REAL
     ================================================ */

  const nombre = form.querySelector('[name="nombre"]');
  const telefono = form.querySelector('[name="telefono"]');
  const email = form.querySelector('[name="email"]');
  const interes = form.querySelector('[name="interes"]');
  const mensaje = form.querySelector('[name="mensaje"]');

 if(nombre){

  nombre.addEventListener('input', function(){

    // No permite números ni símbolos mientras escribe
    nombre.value = nombre.value.replace(
      /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g,
      ''
    );

    validarNombre(nombre);

  });

}

if(telefono){

  telefono.addEventListener('input', function(){

    // Solo permite números
    telefono.value = telefono.value.replace(/[^0-9]/g, '');

    validarTelefono(telefono);

  });

}



  if(email){
    email.addEventListener('input', function(){
      validarEmail(email);
    });
  }

  if(interes){
    interes.addEventListener('change', function(){
      validarInteres(interes);
    });
  }

  if(mensaje){
    mensaje.addEventListener('input', function(){
      validarMensaje(mensaje);
    });
  }

})();



  // Real-time border color reset
  $$('.fi', form).forEach(input=>{
    input.addEventListener('input',()=> input.style.borderColor='');
  });
;

/* ================================================
   8. BUTTON RIPPLE EFFECT
   ================================================ */
document.addEventListener('click', e=>{
  const btn = e.target.closest('.btn, .fs, .card-btn');
  if(!btn) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.5;
  const x = e.clientX - rect.left - size/2;
  const y = e.clientY - rect.top  - size/2;

  const ripple = document.createElement('span');
  ripple.className = 'btn-ripple';
  ripple.style.cssText = `
    width:${size}px;height:${size}px;
    left:${x}px;top:${y}px;
  `;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(()=> ripple.remove(), 520);
});

/* ================================================
   9. PARALLAX SECTIONS on scroll
   ================================================ */
(function(){
  const parallaxEls = $$('[data-parallax]');
  if(!parallaxEls.length) return;

  let ticking = false;
  function updateParallax(){
    const sy = window.scrollY;
    parallaxEls.forEach(el=>{
      const speed  = parseFloat(el.dataset.parallax)||0.15;
      const rect   = el.getBoundingClientRect();
      const center = rect.top + rect.height/2;
      const viewH  = window.innerHeight;
      const offset = (viewH/2 - center) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll',()=>{
    if(!ticking){
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  },{passive:true});
})();

/* ================================================
   10. CARD PRODUCT — image tilt on mouse
   ================================================ */
(function(){
  const cards = $$('.card');
  cards.forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        `translateY(-14px) scale(1.02) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform = '';
      card.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
  });
})();

/* ================================================
   11. PAGE LOADED — trigger initial animations
   ================================================ */
window.addEventListener('load',()=>{
  document.body.classList.add('loaded');

  // Stagger cards reveal
  $$('.card').forEach((card, i)=>{
    card.style.transitionDelay = `${i*0.08}s`;
  });

  // Stagger catalog items
  $$('.cat-item').forEach((item, i)=>{
    item.style.transitionDelay = `${i*0.05}s`;
  });
});



// Reemplaza el setTimeout de éxito por esto:
fetch('/api/mensajes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: nombre.value,
    telefono: telefono.value,
    email: email.value,
    interes: interes.value,
    mensaje: mensaje.value
  })
}).then(() => {
  form.style.display = 'none';
  if (success) {
    success.style.display = 'block';
    success.innerHTML = `<div style="font-size:3rem">✅</div>
      <strong>¡Mensaje enviado!</strong>
      <p>Nos pondremos en contacto contigo pronto.</p>`;
  }
});