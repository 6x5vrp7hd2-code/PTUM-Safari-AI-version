(function(){
  var menu = document.getElementById('menu'), open = document.getElementById('openMenu'), shut = document.getElementById('closeMenu');
  function close(){ menu.hidden = true; open.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; open.focus(); }
  open.addEventListener('click', function(){ menu.hidden = false; open.setAttribute('aria-expanded','true'); document.body.style.overflow = 'hidden'; shut.focus(); });
  shut.addEventListener('click', close);
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ if(a.getAttribute('href').indexOf('#') > -1) close(); }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !menu.hidden) close(); });
  var back = document.getElementById('pageBack');
  if(back) back.addEventListener('click', function(){
    var same = false; try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch(_){}
    if(same && history.length > 1) history.back(); else location.href = 'index.html';
  });
})();

/* Background photographs that fade from one to the next behind a section */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-bg]').forEach(function(sec){
    var list = sec.getAttribute('data-bg').split(',').filter(Boolean);
    if(!list.length) return;
    var box = document.createElement('div'); box.className = 'bgfade'; box.setAttribute('aria-hidden','true');
    var layers = list.map(function(src, i){
      var d = document.createElement('div'); d.className = 'bgfade-img' + (i === 0 ? ' on' : '');
      d.dataset.src = src; box.appendChild(d); return d;
    });
    function load(d){ if(d.dataset.src){ d.style.backgroundImage = "url('" + d.dataset.src + "')"; d.removeAttribute('data-src'); } }
    sec.insertBefore(box, sec.firstChild);
    var i = 0, timer = null;
    function start(){
      load(layers[0]); if(layers[1]) load(layers[1]);
      if(reduce || layers.length < 2 || timer) return;
      timer = setInterval(function(){
        layers[i].classList.remove('on'); i = (i + 1) % layers.length;
        layers[i].classList.add('on'); load(layers[(i + 1) % layers.length]);
      }, 5500);
    }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es.forEach(function(e){ e.isIntersecting ? start() : stop(); }); }, {rootMargin:'200px 0px'}).observe(sec);
    } else start();
  });
})();
