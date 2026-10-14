(function(){
  var CONFIG=window.CONFIG;
  var COLORS=CONFIG.coloresRuleta;
  var people=[];
  function mkImg(src){ if(!src) return null; var im=new Image(); im.onload=function(){draw()}; im.src=src; return im; }
  CONFIG.integrantes.forEach(function(n,i){people.push({name:n,bg:mkImg((CONFIG.imagenesFondo||[])[i])})});
  var SURPRISES=CONFIG.sorpresas.map(function(x){return {name:x.nombre,kind:x.tipo,emoji:x.emoji,bg:mkImg(x.fondo)}});
  var used={}, rot=0, spinning=false, doubleOn=false, current=null;
  var audio=null;
  var cv=document.getElementById('wheel'), ctx=cv.getContext('2d');
  var $=function(id){return document.getElementById(id)};

  function segs(){
    var s=people.map(function(p,i){return {label:p.name||('Integrante '+(i+1)),kind:'person',idx:i,img:p.img||null,bg:p.bg||null}});
    return s.concat(SURPRISES.map(function(x){return {label:x.name,kind:x.kind,emoji:x.emoji,bg:x.bg||null}}));
  }
  function draw(){
    var S=segs(), n=S.length, arc=2*Math.PI/n, W=cv.width, c=W/2, r=c-14;
    ctx.clearRect(0,0,W,W);
    S.forEach(function(sg,i){
      var a0=rot+i*arc, a1=a0+arc;
      ctx.beginPath(); ctx.moveTo(c,c); ctx.arc(c,c,r,a0,a1); ctx.closePath();
      ctx.fillStyle=COLORS[i%COLORS.length]; ctx.fill();
      var bi=sg.bg;
      if(bi&&bi.complete&&bi.naturalWidth){
        ctx.save(); ctx.beginPath(); ctx.moveTo(c,c); ctx.arc(c,c,r,a0,a1); ctx.closePath(); ctx.clip();
        ctx.translate(c,c); ctx.rotate(a0+arc/2+Math.PI/2);
        var bw=2*r*Math.sin(Math.min(arc/2,Math.PI/2)), bh=r, sc=Math.max(bw/bi.naturalWidth,bh/bi.naturalHeight);
        ctx.drawImage(bi,-bi.naturalWidth*sc/2,-r/2-bi.naturalHeight*sc/2,bi.naturalWidth*sc,bi.naturalHeight*sc);
        ctx.restore();
      }
      ctx.lineWidth=8; ctx.strokeStyle=CONFIG.bordeRuleta; ctx.stroke();
      ctx.save(); ctx.translate(c,c); ctx.rotate(a0+arc/2);
      ctx.textAlign='right'; ctx.textBaseline='middle';
      var hasImg=!!(sg.img&&sg.img.complete);
      ctx.font=hasImg?'bold 30px Fredoka, sans-serif':'bold 40px Fredoka, sans-serif';
      var txt=(sg.emoji?sg.emoji+' ':'')+sg.label;
      var lim=hasImg?10:16;
      if(txt.length>lim) txt=txt.slice(0,lim-1)+'…';
      if(hasImg){
        ctx.save(); ctx.translate(r*0.4,0); ctx.rotate(-(a0+arc/2));
        ctx.beginPath(); ctx.arc(0,0,61,0,7); ctx.fillStyle=CONFIG.bordeRuleta; ctx.fill();
        ctx.beginPath(); ctx.arc(0,0,56,0,7); ctx.clip();
        ctx.drawImage(sg.img,-56,-56,112,112); ctx.restore();
      }
      ctx.lineWidth=7; ctx.strokeStyle=CONFIG.bordeRuleta; ctx.strokeText(txt,r-30,0);
      ctx.fillStyle=CONFIG.textoRuleta; ctx.fillText(txt,r-30,0);
      ctx.restore();
    });
    // bombillas del borde
    for(var k=0;k<24;k++){
      var a=k*Math.PI/12+rot*0.0, x=c+Math.cos(a)*(r+2), y=c+Math.sin(a)*(r+2);
      ctx.beginPath(); ctx.arc(x,y,9,0,7); ctx.fillStyle=(k%2?'#FFD23F':'#FFF3D6'); ctx.fill();
      ctx.lineWidth=3; ctx.strokeStyle=CONFIG.bordeRuleta; ctx.stroke();
    }
    // centro
    ctx.beginPath(); ctx.arc(c,c,46,0,7); ctx.fillStyle='#FFD23F'; ctx.fill(); ctx.lineWidth=8; ctx.strokeStyle=CONFIG.bordeRuleta; ctx.stroke();
    ctx.font='44px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle=CONFIG.bordeRuleta; ctx.fillText('🎪',c,c+3);
  }

  function beep(f,d,type,vol){
    if($('mute').checked) return;
    try{
      audio=audio||new (window.AudioContext||window.webkitAudioContext)();
      var o=audio.createOscillator(), g=audio.createGain();
      o.type=type||'square'; o.frequency.value=f; g.gain.value=vol||0.05;
      o.connect(g); g.connect(audio.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.0001,audio.currentTime+d); o.stop(audio.currentTime+d);
    }catch(e){}
  }
  function fanfare(){[523,659,784,1047].forEach(function(f,i){setTimeout(function(){beep(f,.22,'triangle',.08)},i*120)})}

  function pickTarget(){
    var S=segs(), pool=[];
    S.forEach(function(sg,i){ if(sg.kind!=='person'||!$('norep').checked||!used[sg.idx]) pool.push(i) });
    if(!pool.length){ used={}; S.forEach(function(sg,i){pool.push(i)}); }
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function spin(){
    if(spinning) return;
    spinning=true; $('spin').disabled=true;
    var S=segs(), n=S.length, arc=2*Math.PI/n, t=pickTarget();
    var a=t*arc+arc/2+(Math.random()-.5)*arc*.6;
    var desired=-Math.PI/2-a, TAU=2*Math.PI;
    var delta=(((desired-rot)%TAU)+TAU)%TAU+TAU*(5+Math.floor(Math.random()*3));
    var from=rot, dur=5200, t0=performance.now(), lastIdx=-1;
    $('who').textContent='¡Girando…!'; $('pic').hidden=true;
    function frame(now){
      var p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,4);
      rot=from+delta*e; draw();
      var idx=Math.floor((((-Math.PI/2-rot)%TAU)+TAU)%TAU/arc);
      if(idx!==lastIdx){ lastIdx=idx; beep(700+idx*40,.05,'square',.03); }
      if(p<1) requestAnimationFrame(frame); else done(t);
    }
    requestAnimationFrame(frame);
  }

  function done(i){
    spinning=false; $('spin').disabled=false; fanfare();
    var sg=segs()[i], pic=$('pic'); pic.hidden=true;
    $('who').textContent=(sg.emoji?sg.emoji+' ':'')+sg.label;
    if(sg.kind==='person'){
      used[sg.idx]=true; current=sg.idx;
      if(people[sg.idx].img){ pic.src=people[sg.idx].imgSrc; pic.hidden=false; }
    }
  }



  function loadImg(p,file){
    if(!file) return;
    var fr=new FileReader();
    fr.onload=function(){
      var im=new Image();
      im.onload=function(){
        var s=Math.min(im.width,im.height), c=document.createElement('canvas'); c.width=c.height=240;
        c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,240,240);
        p.imgSrc=c.toDataURL('image/jpeg',.85);
        var o=new Image(); o.onload=function(){p.img=o; draw()}; o.src=p.imgSrc;
      };
      im.src=fr.result;
    };
    fr.readAsDataURL(file);
  }

  function loadBg(p,file){
    if(!file) return;
    var fr=new FileReader();
    fr.onload=function(){ var im=new Image(); im.onload=function(){p.bg=im; draw()}; im.src=fr.result; };
    fr.readAsDataURL(file);
  }

  // Configuración
  var cfg=$('cfg');
  people.forEach(function(p,i){
    var row=document.createElement('div'); row.className='row';
    row.innerHTML='<input aria-label="Nombre integrante '+(i+1)+'" value="'+p.name+'"><label style="grid-column:1/-1;font-size:15px">Foto circular (opcional): <input type="file" accept="image/*" aria-label="Imagen integrante '+(i+1)+'"></label><label style="grid-column:1/-1;font-size:15px">Fondo del sector (reemplaza el color): <input type="file" accept="image/*" aria-label="Fondo integrante '+(i+1)+'"></label>';
    var inputs=row.querySelectorAll('input');
    inputs[0].addEventListener('input',function(){p.name=inputs[0].value; draw()});
    inputs[1].addEventListener('change',function(){loadImg(p,inputs[1].files[0])});
    inputs[2].addEventListener('change',function(){loadBg(p,inputs[2].files[0])});
    cfg.appendChild(row);
  });

  $('spin').addEventListener('click',spin);
  $('reset').addEventListener('click',function(){
    used={}; current=null;
    $('who').textContent='¡Gira la ruleta!'; $('pic').hidden=true;
  });
  // Aplicar configuración inicial (config.js)
  var root=document.documentElement, C=CONFIG.colores||{};
  var map={rojo:'--red',azul:'--blue',amarillo:'--yellow',rosa:'--pink',menta:'--mint',fondo:'--bg',texto:'--ink',tarjeta:'--card'};
  Object.keys(map).forEach(function(k){ if(C[k]) root.style.setProperty(map[k],C[k]); });
  var g=document.querySelector('.glitch'); g.textContent=CONFIG.titulo; g.setAttribute('data-text',CONFIG.titulo);
  document.title=CONFIG.titulo;
  document.querySelector('.sub').textContent=CONFIG.subtitulo;
  $('mute').checked=!CONFIG.sonido; $('norep').checked=CONFIG.noRepetir;
  $('spin').textContent=CONFIG.textoBoton;
  draw();
})();
