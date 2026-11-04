(function(){
  var menu=document.getElementById('menu'),open=document.querySelector('[data-menu-open]'),close=document.querySelector('[data-menu-close]');
  function set(on){menu.hidden=!on;open.setAttribute('aria-expanded',on);document.body.classList.toggle('menu-open',on);(on?close:open).focus()}
  open.addEventListener('click',function(){set(true)});
  close.addEventListener('click',function(){set(false)});
  menu.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden)set(false)});
  var top=document.querySelector('[data-totop]');
  function onScroll(){top.classList.toggle('on',scrollY>600)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  var back=document.querySelector('[data-history-back]');
  if(back)back.addEventListener('click',function(){
    if(history.length>1&&document.referrer.indexOf(location.host)>-1)history.back();
    else location.href=document.querySelector('[data-home-link]').href;
  });

  var mq=matchMedia('(max-width:760px)'),rd=[].slice.call(document.querySelectorAll('[data-rd]'));
  function applyRd(){rd.forEach(function(d){d.open=!mq.matches})}
  applyRd();(mq.addEventListener?mq.addEventListener('change',applyRd):mq.addListener(applyRd));
  document.addEventListener('click',function(e){var s=e.target.closest('[data-rd]>summary');if(s&&!mq.matches)e.preventDefault()});

  [].forEach.call(document.querySelectorAll('.cat-nav'),function(n){var a=n.querySelector('.is-active');if(a)n.scrollLeft=a.offsetLeft-n.offsetLeft-16});

  var rail=document.querySelector('.rail'),pin0=document.getElementById('hero-pin');
  var formBox=document.querySelector('.form-card');
  function railOn(){
    var r=formBox&&formBox.getBoundingClientRect(),overForm=r&&r.top<innerHeight&&r.bottom>0;
    rail.classList.toggle('on',(!pin0||scrollY>pin0.offsetHeight-innerHeight*.6)&&!overForm);
  }
  addEventListener('scroll',railOn,{passive:true});railOn();

  var form=document.getElementById('formularz');
  if(form&&/github\.io$/.test(location.hostname))form.addEventListener('submit',function(e){
    e.preventDefault();var f=form.elements;
    var t='Nazwa: '+f.nazwa.value+'\nTelefon: '+f.telefon.value+'\nE-mail: '+f.mail.value+'\nKwota kredytu: '+f.kwota.value+'\nCel kredytu: '+f.cel.value+'\n\n'+f.zobowiazania.value;
    location.href='mailto:kontakt@kredytyubezpieczenia.com?subject='+encodeURIComponent('Zapytanie ze strony')+'&body='+encodeURIComponent(t);
  });
  var q=new URLSearchParams(location.search).get('formularz');
  var el=q&&document.querySelector(q==='ok'?'[data-form-ok]':'[data-form-err]');
  if(el){el.hidden=false;el.scrollIntoView({block:'center'})}
})();
(function(){
  var root=document.documentElement,pin=document.getElementById('hero-pin');
  if(!pin||!root.classList.contains('anim'))return;
  var hero=pin.querySelector('.hero'),svg=document.getElementById('hero-art'),text=pin.querySelector('.hero-in'),hint=pin.querySelector('.hero-hint'),bar=pin.querySelector('.story-bar i');
  var steps=[].slice.call(pin.querySelectorAll('.story-step')),car=document.getElementById('car'),wheels=car?[].slice.call(car.querySelectorAll('.wh')):[];
  var shield=document.getElementById('car-shield');
  function clamp(v){return v<0?0:v>1?1:v}
  function ease(t){return t*t*(3-2*t)}
  var groups=[].slice.call(svg.querySelectorAll('g[data-s]')).map(function(g){
    var els=[].slice.call(g.querySelectorAll('path,rect,circle')),n=els.length,dur=Math.min(1,Math.max(.22,4/n));
    els.forEach(function(el){el.setAttribute('pathLength','1');el.style.strokeDasharray='1 1';el.style.strokeDashoffset='1';el.style.visibility='hidden'});
    return{els:els,s:+g.dataset.s,e:+g.dataset.e,dur:dur,last:-1};
  });
  var fades=[].slice.call(svg.querySelectorAll('[data-f]')).map(function(g){var r=g.dataset.f.split(' ');return{el:g,s:+r[0],e:+r[1]}});
  var narrow=false;
  function layout(){
    var ratio=innerWidth/innerHeight;narrow=ratio<1.2;
    svg.setAttribute('preserveAspectRatio',narrow||ratio>1.85?'xMidYMax meet':'xMidYMax slice');
    if(!narrow)svg.setAttribute('viewBox','0 0 1800 1000');
  }
  function draw(p){
    groups.forEach(function(g){
      var gp=clamp((p-g.s)/(g.e-g.s));
      if(gp===g.last)return;g.last=gp;
      var n=g.els.length;
      for(var i=0;i<n;i++){
        var st=n>1?i/(n-1)*(1-g.dur):0,t=clamp((gp-st)/g.dur),el=g.els[i];
        el.style.strokeDashoffset=1-t;el.style.visibility=t>0?'visible':'hidden';
      }
    });
    fades.forEach(function(f){f.el.style.opacity=clamp((p-f.s)/(f.e-f.s))});
    if(car){
      var x=560+ease(clamp((p-.41)/.14))*480;
      car.setAttribute('transform','translate('+x.toFixed(1)+' 915)');
      var deg=(x-560)/22*57.3;
      wheels.forEach(function(w){w.setAttribute('transform','rotate('+deg.toFixed(1)+' '+w.dataset.c+')')});
      if(shield)shield.style.opacity=1-clamp((p-.54)/.03);
    }
    if(narrow){
      var cam=150+ease(clamp((p-.38)/.2))*730;
      svg.setAttribute('viewBox',cam.toFixed(1)+' 0 760 1000');
    }
    var a=1-clamp(p/.06);
    text.style.opacity=a;text.style.transform='translateY('+(-(1-a)*40).toFixed(1)+'px)';text.style.visibility=a>0?'visible':'hidden';
    hint.style.opacity=1-clamp(p/.03);hint.style.visibility=p<.03?'visible':'hidden';
    hero.style.setProperty('--ov',1-clamp(p/.07));
    bar.style.transform='scaleX('+p.toFixed(4)+')';
    steps.forEach(function(s){
      var b=+s.dataset.s,e=+s.dataset.e,o=Math.min(clamp((p-b)/.02),clamp((e-p)/.02));
      s.style.opacity=o;s.style.visibility=o>0?'visible':'hidden';s.style.transform='translateY('+((1-o)*14).toFixed(1)+'px)';
    });
  }
  var cur=-1,target=0,run=false;
  function read(){var r=pin.getBoundingClientRect();target=clamp(-r.top/(pin.offsetHeight-innerHeight))}
  function tick(){
    var d=target-cur;
    if(Math.abs(d)<.0006){cur=target;draw(cur);run=false;return}
    cur+=d*.14;draw(cur);requestAnimationFrame(tick);
  }
  function kick(){read();if(!run){run=true;requestAnimationFrame(tick)}}
  addEventListener('scroll',kick,{passive:true});
  addEventListener('resize',function(){layout();kick();draw(cur)});
  layout();read();cur=target;draw(cur);
})();
