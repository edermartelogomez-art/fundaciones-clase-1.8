"use strict";

const $ = (id) => document.getElementById(id);
const screens = [...document.querySelectorAll(".screen")];
const lessons = [
  {title:"Introducción", sub:"¿Qué ocurre bajo una edificación?", top:"Esfuerzos verticales en el suelo", desc:"Peso propio y cargas aplicadas"},
  {title:"Carga, área y esfuerzo", sub:"σ = P/A", top:"Carga, área y esfuerzo", desc:"La misma carga puede generar esfuerzos distintos"},
  {title:"Peso propio", sub:"σᵥ = γz", top:"Peso propio del suelo", desc:"Perfil esfuerzo–profundidad en suelo homogéneo"},
  {title:"Suelo estratificado", sub:"Variación de γ", top:"Suelo estratificado", desc:"Aportes acumulados y cambios de pendiente"},
  {title:"Sobrecarga superficial", sub:"Efecto de q", top:"Sobrecarga superficial", desc:"Desplazamiento del perfil de esfuerzo"},
  {title:"Ejemplos guiados", sub:"Calcular e interpretar", top:"Ejemplos guiados", desc:"Del perfil al resultado y a su significado físico"},
  {title:"Modelación", sub:"Ejercicio aplicado", top:"Modelación de una zapata", desc:"Resuelve, comprueba e interpreta"}
];

const guideData = [
  {
    purpose:"Activar la idea de transmisión de cargas y diferenciar equilibrio de ausencia de fuerzas.",
    script:"Aunque el edificio no se mueva, la gravedad sigue actuando. La cimentación recibe esa carga y la distribuye hacia el terreno.",
    questions:["¿Qué cambia si el mismo edificio se apoya sobre una zapata más grande?","¿Por qué una estructura en equilibrio sigue transmitiendo carga?"],
    errors:["Confundir equilibrio con ausencia de fuerzas.","Interpretar las líneas de esfuerzo como grietas o desplazamientos reales."]
  },
  {
    purpose:"Construir la relación inversa entre área de contacto y esfuerzo para una carga dada.",
    script:"No basta mirar la carga. El efecto sobre el suelo depende de cuánto espacio tiene esa carga para repartirse.",
    questions:["¿Qué ocurre con σ si duplicamos A y mantenemos P?","¿Puede una carga menor producir mayor esfuerzo que una carga mayor?"],
    errors:["Olvidar que kN/m² equivale a kPa.","Suponer que mayor área implica mayor esfuerzo."]
  },
  {
    purpose:"Relacionar el peso de una columna de suelo con el incremento lineal de σᵥ.",
    script:"A mayor profundidad, hay más material por encima del punto. En suelo homogéneo, cada metro agrega la misma cantidad γ.",
    questions:["¿Qué representa la pendiente de la recta?","¿Qué pasa con el perfil si γ aumenta?"],
    errors:["Usar densidad sin convertirla a peso unitario.","Pensar que el punto solo soporta el suelo inmediatamente superior."]
  },
  {
    purpose:"Integrar sobrecarga, estratos y lectura de una gráfica lineal por tramos.",
    script:"El esfuerzo no se reinicia al cambiar de capa. Continúa acumulándose; lo que cambia es la rapidez con la que crece.",
    questions:["¿Por qué el perfil es continuo en la interfaz?","¿Qué capa produce la pendiente mayor?"],
    errors:["Sumar espesores sin multiplicar por γ.","Interpretar el cambio de pendiente como un salto del esfuerzo."]
  },
  {
    purpose:"Distinguir el aporte constante de q del aporte creciente γz.",
    script:"La sobrecarga ya actúa en la superficie. Por eso el perfil empieza en q y luego aumenta con la misma pendiente γ.",
    questions:["¿Por qué ambas rectas son paralelas?","¿Qué valor tiene σᵥ en z = 0 cuando q ≠ 0?"],
    errors:["Hacer que q aumente con la profundidad.","Sumar q varias veces al atravesar capas."]
  },
  {
    purpose:"Consolidar un procedimiento que incluya cálculo, unidades e interpretación física.",
    script:"Un resultado técnico debe decir qué cargas contiene, dónde se evalúa y qué significa físicamente.",
    questions:["¿Qué contribuciones aparecen en cada ejemplo?","¿Cuál ejemplo tendría mayor pendiente y por qué?"],
    errors:["Reportar solo un número sin unidades.","Confundir esfuerzo total con capacidad portante o resistencia."]
  },
  {
    purpose:"Aplicar de manera autónoma la relación σ = P/A y justificar el resultado.",
    script:"Primero identifica los datos y calcula el área. Después divide la carga entre el área y traduce el valor a una frase física.",
    questions:["¿Qué unidad resulta de kN/m²?","¿Cómo cambiaría σ si se duplicara el largo de la zapata?"],
    errors:["Sumar las dimensiones en lugar de multiplicarlas.","Confundir 120 kPa con una fuerza total de 120 kN."]
  }
];

let current = 0;
const sideNav = $("sideNav");
const dots = $("dots");
const prevBtn = $("prevBtn");
const nextBtn = $("nextBtn");

lessons.forEach((lesson, i) => {
  const btn = document.createElement("button");
  btn.className = "nav-item";
  btn.innerHTML = `<span class="nav-num">${i + 1}</span><span class="nav-copy"><strong>${lesson.title}</strong><small>${lesson.sub}</small></span>`;
  btn.addEventListener("click", () => showScreen(i));
  sideNav.appendChild(btn);

  const dot = document.createElement("button");
  dot.className = "dot";
  dot.textContent = i + 1;
  dot.setAttribute("aria-label", `Ir a ${lesson.title}`);
  dot.addEventListener("click", () => showScreen(i));
  dots.appendChild(dot);
});

function showScreen(index) {
  current = Math.max(0, Math.min(screens.length - 1, index));
  screens.forEach((screen, i) => screen.classList.toggle("active", i === current));
  [...sideNav.children].forEach((item, i) => item.classList.toggle("active", i === current));
  [...dots.children].forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
    dot.classList.toggle("done", i < current);
  });
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === screens.length - 1;
  $("progressText").textContent = `${current + 1} / ${screens.length}`;
  $("progressFill").style.width = `${((current + 1) / screens.length) * 100}%`;
  $("breadcrumbTitle").textContent = lessons[current].title;
  $("screenTitle").textContent = lessons[current].top;
  $("screenSubtitle").textContent = lessons[current].desc;
  updateGuide();
  closeSidebar();
  requestAnimationFrame(() => drawCurrent());
}

function drawCurrent() {
  if (current === 0) updateIntro();
  if (current === 1) updatePA();
  if (current === 2) updateDepth();
  if (current === 3) updateLayers();
  if (current === 4) updateOverload();
  if (current === 5) renderGuidedExamples();
  if (current === 6) drawModel();
}

prevBtn.addEventListener("click", () => showScreen(current - 1));
nextBtn.addEventListener("click", () => showScreen(current + 1));
window.addEventListener("keydown", (event) => {
  if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
  if (event.key === "ArrowRight") showScreen(current + 1);
  if (event.key === "ArrowLeft") showScreen(current - 1);
});
window.addEventListener("resize", () => requestAnimationFrame(drawCurrent));

// Navegación móvil
const sidebar = $("sidebar");
const sidebarBackdrop = $("sidebarBackdrop");
function openSidebar(){sidebar.classList.add("open");sidebarBackdrop.classList.add("open")}
function closeSidebar(){sidebar.classList.remove("open");sidebarBackdrop.classList.remove("open")}
$("menuBtn").addEventListener("click", openSidebar);
$("sidebarClose").addEventListener("click", closeSidebar);
sidebarBackdrop.addEventListener("click", closeSidebar);

// Diálogos y guía docente
const objectivesDialog = $("objectivesDialog");
$("objectivesBtn").addEventListener("click", () => objectivesDialog.showModal());
$("closeDialog").addEventListener("click", () => objectivesDialog.close());
const guideDrawer = $("guideDrawer");
const drawerBackdrop = $("drawerBackdrop");
function openGuide(){guideDrawer.classList.add("open");drawerBackdrop.classList.add("open");guideDrawer.setAttribute("aria-hidden","false")}
function closeGuide(){guideDrawer.classList.remove("open");drawerBackdrop.classList.remove("open");guideDrawer.setAttribute("aria-hidden","true")}
$("guideBtn").addEventListener("click", openGuide);
$("guideClose").addEventListener("click", closeGuide);
drawerBackdrop.addEventListener("click", closeGuide);
function updateGuide(){
  const g = guideData[current];
  $("guideTitle").textContent = lessons[current].title;
  $("guideContent").innerHTML = `
    <section class="guide-section"><h4>Propósito didáctico</h4><p>${g.purpose}</p></section>
    <section class="guide-section"><h4>Guion sugerido</h4><div class="guide-script">“${g.script}”</div></section>
    <section class="guide-section"><h4>Preguntas para conducir la clase</h4><ul>${g.questions.map(q=>`<li>${q}</li>`).join("")}</ul></section>
    <section class="guide-section"><h4>Errores que debes vigilar</h4><ul>${g.errors.map(q=>`<li>${q}</li>`).join("")}</ul></section>
    <section class="guide-section"><h4>Escritura mínima en tablero</h4><div class="guide-script">${boardFormula(current)}</div></section>`;
}
function boardFormula(i){return ["σ = P/A","σ = P/A","W = γAz → σᵥ = γz","σᵥ = q + Σγᵢhᵢ","σᵥ = q + γz","Identificar → Sustituir → Calcular → Interpretar","A = B·L; σ = P/A"][i]}

$("fullBtn").addEventListener("click", async () => {
  try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen(); }
  catch { showToast("El navegador no permitió activar la pantalla completa."); }
});

document.querySelectorAll(".help-dot").forEach(btn => btn.addEventListener("click", () => showToast(btn.dataset.help)));
function showToast(message){const toast=$("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),3200)}

// SVG helpers
const NS = "http://www.w3.org/2000/svg";
function S(tag, attrs = {}, text = "") {
  const el = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  if (text !== "") el.textContent = text;
  return el;
}
function svgText(svg, x, y, text, attrs={}) { const t=S("text",{x,y,fill:"#a9c0cf","font-size":12,...attrs},text); svg.appendChild(t); return t; }
function addDefs(svg, html){const holder=document.createElementNS(NS,"defs");holder.innerHTML=html;svg.appendChild(holder);return holder}
function niceMax(value, step=50){return Math.max(step,Math.ceil(value/step)*step)}
function stressColor(value){if(value>=240)return"#ef4746";if(value>=160)return"#ff7b2d";if(value>=90)return"#f4c63f";if(value>=50)return"#45c985";return"#2788ee"}
function stressWord(value){if(value>=240)return"Muy alta";if(value>=160)return"Alta";if(value>=90)return"Moderada";if(value>=50)return"Baja";return"Muy baja"}
function chartFrame(svg,{maxX,maxY,xTitle,yTitle,invertY=false,xTicks=5,yTicks=5}){
  svg.innerHTML="";
  const W=720,H=390,L=64,R=20,T=30,B=52,pw=W-L-R,ph=H-T-B;
  const x=v=>L+(v/maxX)*pw;
  const y=v=>invertY?T+(v/maxY)*ph:T+ph-(v/maxY)*ph;
  addDefs(svg,`<linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#28c8ff" stop-opacity=".35"/><stop offset="1" stop-color="#28c8ff" stop-opacity="0"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
  for(let i=0;i<=xTicks;i++){const v=maxX*i/xTicks;svg.appendChild(S("line",{x1:x(v),y1:T,x2:x(v),y2:T+ph,stroke:"#17384e","stroke-width":1}));svgText(svg,x(v),T+ph+22,Number.isInteger(v)?v:v.toFixed(1),{"text-anchor":"middle","font-size":11});}
  for(let i=0;i<=yTicks;i++){const v=maxY*i/yTicks;svg.appendChild(S("line",{x1:L,y1:y(v),x2:L+pw,y2:y(v),stroke:"#17384e","stroke-width":1}));svgText(svg,L-10,y(v)+4,Math.round(v),{"text-anchor":"end","font-size":11});}
  svg.appendChild(S("line",{x1:L,y1:T,x2:L,y2:T+ph,stroke:"#d7e7ef","stroke-width":1.8}));
  svg.appendChild(S("line",{x1:L,y1:T+ph,x2:L+pw,y2:T+ph,stroke:"#d7e7ef","stroke-width":1.8}));
  svgText(svg,L+pw/2,H-9,xTitle,{"text-anchor":"middle","font-size":13,"font-weight":750,fill:"#e9f5fb"});
  svgText(svg,18,T+ph/2,yTitle,{"text-anchor":"middle","font-size":13,"font-weight":750,fill:"#e9f5fb",transform:`rotate(-90 18 ${T+ph/2})`});
  return {x,y,L,R,T,B,pw,ph,W,H};
}
function addPoint(svg, frame, xv, yv, label, color="#ffb547"){
  const cx=frame.x(xv),cy=frame.y(yv);
  svg.appendChild(S("line",{x1:frame.L,y1:cy,x2:cx,y2:cy,stroke:color,"stroke-width":1.5,"stroke-dasharray":"5 5",opacity:.75}));
  svg.appendChild(S("line",{x1:cx,y1:cy,x2:cx,y2:frame.T+frame.ph,stroke:color,"stroke-width":1.5,"stroke-dasharray":"5 5",opacity:.75}));
  svg.appendChild(S("circle",{cx,cy,r:7,fill:color,stroke:"#071522","stroke-width":4,filter:"url(#glow)"}));
  const bw=112,bh=30,bx=Math.min(cx+11,frame.W-bw-9),by=Math.max(7,cy-37);
  svg.appendChild(S("rect",{x:bx,y:by,width:bw,height:bh,rx:8,fill:"#0d2c45",stroke:color,"stroke-width":1}));
  svgText(svg,bx+bw/2,by+20,label,{"text-anchor":"middle",fill:"#fff","font-weight":850,"font-size":11});
}

// Introducción
const heroForceOverlay = $("heroForceOverlay");
const introHeroCard = heroForceOverlay?.closest(".hero-card");
let introAnimating=false;
$("animateBtn").addEventListener("click",()=>{
  introAnimating=!introAnimating;
  heroForceOverlay.classList.toggle("running",introAnimating);
  introHeroCard?.classList.toggle("animating",introAnimating);
  $("animateBtn").innerHTML=introAnimating?"<span>■</span> Detener animación":"<span>▶</span> Animar transmisión";
});
const p=$("p"),a=$("a");
p.addEventListener("input",updateIntro);a.addEventListener("input",updateIntro);
function updateIntro(){
  const P=+p.value,A=+a.value,s=P/A;
  $("pOut").textContent=`${P} kN`;$("aOut").textContent=`${A.toFixed(1)} m²`;$("stressOut").textContent=`${s.toFixed(1)} kPa`;$("mapScale").textContent=`${s.toFixed(0)} kPa`;
  $("stressMsg").textContent=A<3?"Área pequeña: la carga se concentra.":A>9?"Área amplia: el esfuerzo disminuye.":"Carga y área actúan conjuntamente.";
  drawDynamicMap(P,A,s);
}
function drawDynamicMap(P,A,s){
  const heat=$("dynHeat"),contours=$("dynContours"),arrows=$("dynArrows"),footing=$("dynFooting"),pedestal=$("dynPedestal");
  if(!heat)return;heat.innerHTML="";contours.innerHTML="";arrows.innerHTML="";
  const width=125+(A-1)/11*225,x=241-width/2,intensity=Math.min(1,Math.max(.18,s/250));
  footing.setAttribute("x",x);footing.setAttribute("width",width);pedestal.setAttribute("x",241-36);
  const colors=["#2457c9","#20a177","#e2c341","#f08a2f","#e13d3d"];
  for(let i=0;i<5;i++){
    const f=1-i*.15,rx=(90+A*6)*f,ry=(84+intensity*55)*f,cy=100+ry*.48;
    heat.appendChild(S("ellipse",{cx:241,cy,rx,ry,fill:colors[i],opacity:.18+.055*i}));
    const half=rx*.92,top=89,bottom=top+ry*1.18;
    contours.appendChild(S("path",{d:`M${241-half} ${top} C${241-half*.85} ${top+ry*.35},${241-half*.45} ${bottom-12},241 ${bottom} C${241+half*.45} ${bottom-12},${241+half*.85} ${top+ry*.35},${241+half} ${top}`,stroke:colors[i],"stroke-width":2.4+i*.45,opacity:.9}));
  }
  const n=Math.max(4,Math.min(10,Math.round(A/1.3)+3));
  for(let i=0;i<n;i++){const ax=x+width*(i+1)/(n+1),len=24+intensity*25;arrows.appendChild(S("line",{x1:ax,y1:87,x2:ax,y2:87+len,stroke:"#ffad32","stroke-width":3.2,"stroke-linecap":"round"}));arrows.appendChild(S("path",{d:`M${ax-5} ${82+len} L${ax} ${88+len} L${ax+5} ${82+len}`,fill:"none",stroke:"#ffad32","stroke-width":3,"stroke-linecap":"round"}));}
}

// Carga, área y esfuerzo
const p2=$("p2"),a2=$("a2");p2.addEventListener("input",updatePA);a2.addEventListener("input",updatePA);
const paCases=[
  {name:"Casa de 1 piso",P:300,A:6},
  {name:"Edificio mediano",P:900,A:12},
  {name:"Edificio alto",P:1500,A:7.5},
  {name:"Bodega industrial",P:1200,A:18}
];
function renderPACases(){
  $("paExamples").innerHTML=paCases.map((c,i)=>`<article class="example-mini" data-case="${i}"><h4>${c.name}</h4><p>P = ${c.P} kN · A = ${c.A.toFixed(1)} m²</p><strong>σ = ${(c.P/c.A).toFixed(1)} kPa</strong><button aria-label="Usar ejemplo ${c.name}"></button></article>`).join("");
  document.querySelectorAll(".example-mini button").forEach((btn,i)=>btn.addEventListener("click",()=>{p2.value=paCases[i].P;a2.value=paCases[i].A;updatePA();document.querySelectorAll(".example-mini").forEach((card,j)=>card.classList.toggle("active",i===j));}));
}
$("openExamplesBtn").addEventListener("click",()=>showScreen(5));
function updatePA(){
  const P=+p2.value,A=+a2.value,s=P/A;
  $("pOut2").textContent=`${P} kN`;$("aOut2").textContent=`${A.toFixed(1)} m²`;$("stressOut2").textContent=`${s.toFixed(1)} kPa`;
  $("footingWidthText").textContent=A<5?"Pequeña":A>13?"Amplia":"Media";
  $("stressLevelText").textContent=stressWord(s);
  $("paInterpretation").textContent=`Cada metro cuadrado recibe en promedio ${s.toFixed(1)} kN.`;
  $("distributionLabel").textContent=stressWord(s);
  drawPA(P,A,s);drawPADistribution(A,s);
}
function drawPA(P,A,s){
  const svg=$("chartPA"),maxY=niceMax(P*1.05,200),f=chartFrame(svg,{maxX:20,maxY,xTitle:"Área A (m²)",yTitle:"Esfuerzo σ (kPa)",xTicks:5,yTicks:4});
  let path="",fill="";
  for(let x=1;x<=20.001;x+=.2){const y=Math.min(maxY,P/x),cmd=x===1?"M":"L";path+=`${cmd}${f.x(x)} ${f.y(y)} `;}
  fill=`${path}L${f.x(20)} ${f.y(0)} L${f.x(1)} ${f.y(0)} Z`;
  svg.appendChild(S("path",{d:fill,fill:"url(#areaFill)"}));svg.appendChild(S("path",{d:path,fill:"none",stroke:"#28c8ff","stroke-width":5,"stroke-linecap":"round",filter:"url(#glow)"}));
  addPoint(svg,f,A,s,`${s.toFixed(1)} kPa`);
  const fw=90+(A/20)*150,fx=f.W-fw-36;
  svg.appendChild(S("rect",{x:fx,y:46,width:fw,height:17,rx:4,fill:"#c4d0d8"}));
  svg.appendChild(S("rect",{x:fx+fw*.38,y:28,width:fw*.24,height:20,rx:3,fill:"#a7b7c2"}));
  for(let i=0;i<6;i++){const ax=fx+fw*(i+1)/7;svg.appendChild(S("line",{x1:ax,y1:67,x2:ax,y2:84,stroke:stressColor(s),"stroke-width":3}));}
}
function drawPADistribution(A,s){
  const svg=$("paDistribution");svg.innerHTML="";addDefs(svg,`<linearGradient id="soilMini" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#704b32"/><stop offset="1" stop-color="#281914"/></linearGradient><linearGradient id="legendMini" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#2457c9"/><stop offset=".25" stop-color="#20a177"/><stop offset=".5" stop-color="#e2c341"/><stop offset=".75" stop-color="#f08a2f"/><stop offset="1" stop-color="#df3d3d"/></linearGradient>`);
  svg.appendChild(S("rect",{x:20,y:58,width:620,height:135,rx:12,fill:"url(#soilMini)"}));
  const fw=140+A/20*250,fx=330-fw/2;svg.appendChild(S("rect",{x:fx,y:29,width:fw,height:36,rx:5,fill:"#cbd4da"}));
  const colors=["#2457c9","#20a177","#e2c341","#f08a2f","#df3d3d"],depth=64+Math.min(1,s/220)*70;
  colors.forEach((c,i)=>{const scale=1-i*.14;svg.appendChild(S("path",{d:`M${330-(100+A*4)*scale} 67 C${330-(80+A*3)*scale} ${82+depth*.28},${330-(40+A*1.4)*scale} ${78+depth*.74},330 ${72+depth*scale} C${330+(40+A*1.4)*scale} ${78+depth*.74},${330+(80+A*3)*scale} ${82+depth*.28},${330+(100+A*4)*scale} 67`,fill:"none",stroke:c,"stroke-width":4,opacity:.9}));});
  svg.appendChild(S("rect",{x:662,y:58,width:11,height:120,rx:5,fill:"url(#legendMini)"}));svgText(svg,680,70,"Mayor",{"font-size":10});svgText(svg,680,179,"Menor",{"font-size":10});
}

// Peso propio
const g=$("g"),z=$("z");g.addEventListener("input",updateDepth);z.addEventListener("input",updateDepth);
function updateDepth(){const G=+g.value,Z=+z.value,Sv=G*Z;$("gOut").textContent=`${G.toFixed(1)} kN/m³`;$("zOut").textContent=`${Z.toFixed(1)} m`;$("gCalc").textContent=G.toFixed(1);$("zCalc").textContent=Z.toFixed(1);$("svOut").textContent=`${Sv.toFixed(1)} kPa`;drawSoilColumn(G,Z,Sv);drawDepthChart(G,Z,Sv)}
function soilDefs(seed=7){return `<filter id="soilTexture"><feTurbulence type="fractalNoise" baseFrequency=".035 .18" numOctaves="4" seed="${seed}"/><feColorMatrix values=".65 0 0 0 .18 0 .48 0 0 .11 0 0 .34 0 .06 0 0 0 .62 0"/></filter><linearGradient id="soilBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9b6b3c"/><stop offset=".5" stop-color="#704625"/><stop offset="1" stop-color="#4b2e1d"/></linearGradient><linearGradient id="concrete" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#aeb8bd"/><stop offset=".5" stop-color="#68747c"/><stop offset="1" stop-color="#404b52"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-opacity=".38"/></filter>`}
function drawSoilColumn(G,Z,Sv){
  const svg=$("soilColumnSvg");svg.innerHTML="";addDefs(svg,soilDefs(11));
  svgText(svg,215,28,"Columna de suelo homogéneo",{"text-anchor":"middle",fill:"#edf8ff","font-size":15,"font-weight":850});
  const x=115,y=70,w=210,h=450;svg.appendChild(S("rect",{x:x-18,y:y+h,width:w+36,height:42,rx:5,fill:"url(#concrete)",filter:"url(#shadow)"}));
  svg.appendChild(S("rect",{x,y,width:w,height:h,rx:8,fill:"url(#soilBase)",stroke:"#a67546","stroke-width":2}));svg.appendChild(S("rect",{x,y,width:w,height:h,rx:8,filter:"url(#soilTexture)",opacity:.72}));
  svg.appendChild(S("path",{d:`M${x-3} ${y+4} Q${x+20} ${y-10},${x+42} ${y+1} T${x+84} ${y} T${x+126} ${y-1} T${x+168} ${y+1} T${x+w+3} ${y}`,fill:"none",stroke:"#6da449","stroke-width":9,"stroke-linecap":"round"}));
  for(let i=0;i<=10;i++){const yy=y+h*i/10;svg.appendChild(S("line",{x1:70,y1:yy,x2:87,y2:yy,stroke:"#bfd1db","stroke-width":1.4}));svgText(svg,58,yy+4,i,{"text-anchor":"end","font-size":11});}svg.appendChild(S("line",{x1:79,y1:y,x2:79,y2:y+h,stroke:"#bfd1db","stroke-width":1.5}));svgText(svg,48,58,"z (m)",{"font-size":11,fill:"#d7e6ee"});
  const py=y+h*(Z/10);svg.appendChild(S("line",{x1:78,y1:py,x2:x+w+34,y2:py,stroke:"#2dd4f0","stroke-width":2,"stroke-dasharray":"6 5"}));svg.appendChild(S("circle",{cx:x+w,cy:py,r:7,fill:"#27c9ee",stroke:"#fff","stroke-width":2}));
  svgText(svg,x+w+12,py-8,`z = ${Z.toFixed(1)} m`,{fill:"#28d2ef","font-size":12,"font-weight":850});svgText(svg,215,592,`γ = ${G.toFixed(1)} kN/m³ · σᵥ = ${Sv.toFixed(1)} kPa`,{"text-anchor":"middle",fill:"#f1f8fc","font-size":13,"font-weight":800});
  const arrowGroup=S("g",{id:"columnWeightArrows"});for(let i=0;i<5;i++){const ax=x+35+i*35;arrowGroup.appendChild(S("line",{x1:ax,y1:95,x2:ax,y2:145,stroke:"#ffb23b","stroke-width":4,"stroke-linecap":"round"}));arrowGroup.appendChild(S("path",{d:`M${ax-7} 137 L${ax} 149 L${ax+7} 137`,fill:"none",stroke:"#ffb23b","stroke-width":4,"stroke-linecap":"round"}));}svg.appendChild(arrowGroup);
}
function drawDepthChart(G,Z,Sv){
  const svg=$("chartDepth");svg.innerHTML="";const W=650,H=620,L=70,R=25,T=58,B=55,pw=W-L-R,ph=H-T-B,maxX=niceMax(G*10,50),x=v=>L+v/maxX*pw,y=v=>T+v/10*ph;
  addDefs(svg,`<linearGradient id="depthFill" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#24c8ef" stop-opacity=".07"/><stop offset="1" stop-color="#24c8ef" stop-opacity=".32"/></linearGradient><filter id="dGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
  svgText(svg,W/2,28,"Perfil de esfuerzo vertical σᵥ (kPa)",{"text-anchor":"middle",fill:"#edf8ff","font-size":15,"font-weight":850});
  for(let i=0;i<=5;i++){const xv=maxX*i/5;svg.appendChild(S("line",{x1:x(xv),y1:T,x2:x(xv),y2:T+ph,stroke:"#17384e"}));svgText(svg,x(xv),T-12,Math.round(xv),{"text-anchor":"middle","font-size":11});}
  for(let i=0;i<=10;i++){svg.appendChild(S("line",{x1:L,y1:y(i),x2:L+pw,y2:y(i),stroke:"#17384e"}));svgText(svg,L-12,y(i)+4,i,{"text-anchor":"end","font-size":11});}
  svg.appendChild(S("line",{x1:L,y1:T,x2:L,y2:T+ph,stroke:"#dceaf1","stroke-width":1.7}));svg.appendChild(S("line",{x1:L,y1:T,x2:L+pw,y2:T,stroke:"#dceaf1","stroke-width":1.7}));
  const endX=x(G*10),endY=y(10);svg.appendChild(S("path",{d:`M${x(0)} ${y(0)} L${endX} ${endY} L${x(0)} ${endY} Z`,fill:"url(#depthFill)"}));svg.appendChild(S("line",{x1:x(0),y1:y(0),x2:endX,y2:endY,stroke:"#27caf1","stroke-width":5,filter:"url(#dGlow)"}));
  const px=x(Sv),py=y(Z);svg.appendChild(S("line",{x1:L,y1:py,x2:px,y2:py,stroke:"#ffb547","stroke-dasharray":"6 5","stroke-width":1.5}));svg.appendChild(S("line",{x1:px,y1:T,x2:px,y2:py,stroke:"#ffb547","stroke-dasharray":"6 5","stroke-width":1.5}));svg.appendChild(S("circle",{cx:px,cy:py,r:7,fill:"#ffb547",stroke:"#071522","stroke-width":3}));
  const bx=Math.min(px+12,W-150),by=Math.max(T+5,py-42);svg.appendChild(S("rect",{x:bx,y:by,width:135,height:38,rx:9,fill:"#0d2a42",stroke:"#ffb547"}));svgText(svg,bx+67.5,by+16,`z = ${Z.toFixed(1)} m`,{"text-anchor":"middle",fill:"#fff","font-size":11,"font-weight":800});svgText(svg,bx+67.5,by+31,`σᵥ = ${Sv.toFixed(1)} kPa`,{"text-anchor":"middle",fill:"#ffca64","font-size":11,"font-weight":850});
  svgText(svg,W/2,H-15,"Esfuerzo vertical total",{"text-anchor":"middle",fill:"#c9dae4","font-size":11});
}
let columnAnimating=false;
$("animateColumnBtn").addEventListener("click",()=>{columnAnimating=!columnAnimating;const lines=[...document.querySelectorAll("#columnWeightArrows line, #columnWeightArrows path")];lines.forEach((el,i)=>{if(columnAnimating){el._anim=el.animate([{transform:"translateY(-8px)",opacity:.25},{transform:"translateY(25px)",opacity:1},{transform:"translateY(-8px)",opacity:.25}],{duration:950,iterations:Infinity,delay:i*45,easing:"ease-in-out"})}else{el._anim?.cancel()}});$("animateColumnBtn").textContent=columnAnimating?"■ Detener animación":"▶ Animar columna de suelo"});

// Suelo estratificado
const layerInputs=["qLayer","h1","g1","h2","g2"].map($);layerInputs.forEach(el=>el.addEventListener("input",updateLayers));
function updateLayers(){
  const q=+$("qLayer").value,h1=+$("h1").value,G1=+$("g1").value,h2=+$("h2").value,G2=+$("g2").value,s1=G1*h1,s2=G2*h2,total=q+s1+s2,depth=h1+h2;
  $("qLayerOut").textContent=`${q.toFixed(0)} kPa`;$("h1Out").textContent=`${h1.toFixed(1)} m`;$("g1Out").textContent=`${G1.toFixed(1)} kN/m³`;$("h2Out").textContent=`${h2.toFixed(1)} m`;$("g2Out").textContent=`${G2.toFixed(1)} kN/m³`;
  $("layerQSummary").textContent=`${q.toFixed(1)} kPa`;$("layerSoilSummary").textContent=`${(s1+s2).toFixed(1)} kPa`;$("layerTotalOut").textContent=`${total.toFixed(1)} kPa`;$("layer1Out").textContent=`${s1.toFixed(1)} kPa`;$("layer2Out").textContent=`${s2.toFixed(1)} kPa`;$("layerPointOut").textContent=`${total.toFixed(1)} kPa`;
  drawLayerColumn(q,h1,G1,h2,G2,total);drawLayersChart(q,h1,G1,h2,G2,total,depth);
}
function drawLayerColumn(q,h1,G1,h2,G2,total){
  const svg=$("layerColumnSvg");svg.innerHTML="";addDefs(svg,soilDefs(4)+`<filter id="layerTexture2"><feTurbulence type="fractalNoise" baseFrequency=".055 .14" numOctaves="4" seed="19"/><feColorMatrix values=".5 0 0 0 .12 0 .42 0 0 .1 0 0 .32 0 .06 0 0 0 .66 0"/></filter>`);
  svgText(svg,235,27,"Perfil realista del terreno",{"text-anchor":"middle",fill:"#edf8ff","font-size":15,"font-weight":850});
  const x=120,y=93,w=210,h=430,totalH=h1+h2,hh1=h*h1/totalH,hh2=h-hh1;
  for(let i=0;i<7;i++){const ax=x+18+i*29;svg.appendChild(S("line",{x1:ax,y1:48,x2:ax,y2:82,stroke:"#27c9ef","stroke-width":3}));svg.appendChild(S("path",{d:`M${ax-5} 76 L${ax} 84 L${ax+5} 76`,fill:"none",stroke:"#27c9ef","stroke-width":3}));}svgText(svg,225,47,`Sobrecarga q = ${q.toFixed(0)} kPa`,{"text-anchor":"middle",fill:"#7fdef0","font-size":12,"font-weight":800});
  svg.appendChild(S("rect",{x,y,width:w,height:hh1,rx:8,fill:"#987044",stroke:"#c09966"}));svg.appendChild(S("rect",{x,y,width:w,height:hh1,rx:8,filter:"url(#soilTexture)",opacity:.58}));svg.appendChild(S("rect",{x,y:y+hh1,width:w,height:hh2,fill:"#5d442e",stroke:"#8d6c4c"}));svg.appendChild(S("rect",{x,y:y+hh1,width:w,height:hh2,filter:"url(#layerTexture2)",opacity:.65}));
  svg.appendChild(S("rect",{x:x-14,y:y+h,width:w+28,height:38,rx:5,fill:"url(#concrete)"}));
  svgText(svg,x+12,y+25,`Capa 1 · γ₁ = ${G1.toFixed(1)} kN/m³`,{fill:"#fff","font-size":11,"font-weight":800});svgText(svg,x+12,y+hh1+25,`Capa 2 · γ₂ = ${G2.toFixed(1)} kN/m³`,{fill:"#fff","font-size":11,"font-weight":800});
  svg.appendChild(S("line",{x1:77,y1:y,x2:77,y2:y+h,stroke:"#c9d9e1","stroke-width":1.5}));svg.appendChild(S("line",{x1:65,y1:y,x2:88,y2:y,stroke:"#c9d9e1"}));svg.appendChild(S("line",{x1:65,y1:y+hh1,x2:88,y2:y+hh1,stroke:"#c9d9e1"}));svg.appendChild(S("line",{x1:65,y1:y+h,x2:88,y2:y+h,stroke:"#c9d9e1"}));svgText(svg,56,y+5,"0 m",{"text-anchor":"end","font-size":11});svgText(svg,56,y+hh1+5,`${h1.toFixed(1)} m`,{"text-anchor":"end","font-size":11});svgText(svg,56,y+h+5,`${(h1+h2).toFixed(1)} m`,{"text-anchor":"end","font-size":11});
  svg.appendChild(S("line",{x1:78,y1:y+h,x2:x+w+40,y2:y+h,stroke:"#26d1ee","stroke-width":2,"stroke-dasharray":"6 5"}));svg.appendChild(S("circle",{cx:x+w,cy:y+h,r:7,fill:"#26d1ee",stroke:"#fff","stroke-width":2}));svgText(svg,x+w+12,y+h-8,`σᵥ = ${total.toFixed(1)} kPa`,{fill:"#28d3ef","font-size":12,"font-weight":850});
}
function drawLayersChart(q,h1,G1,h2,G2,total,depth){
  const svg=$("chartLayers");svg.innerHTML="";const W=650,H=620,L=70,R=25,T=58,B=55,pw=W-L-R,ph=H-T-B,maxX=niceMax(total*1.15,50),maxY=Math.max(6,Math.ceil(depth)),x=v=>L+v/maxX*pw,y=v=>T+v/maxY*ph;
  addDefs(svg,`<filter id="lGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);svgText(svg,W/2,28,"Perfil σᵥ (kPa)",{"text-anchor":"middle",fill:"#edf8ff","font-size":15,"font-weight":850});
  for(let i=0;i<=5;i++){const xv=maxX*i/5;svg.appendChild(S("line",{x1:x(xv),y1:T,x2:x(xv),y2:T+ph,stroke:"#17384e"}));svgText(svg,x(xv),T-12,Math.round(xv),{"text-anchor":"middle","font-size":11});}
  for(let i=0;i<=maxY;i++){svg.appendChild(S("line",{x1:L,y1:y(i),x2:L+pw,y2:y(i),stroke:"#17384e"}));svgText(svg,L-10,y(i)+4,i,{"text-anchor":"end","font-size":11});}
  svg.appendChild(S("rect",{x:L,y:T,width:pw,height:y(h1)-T,fill:"#b88c53",opacity:.07}));svg.appendChild(S("rect",{x:L,y:y(h1),width:pw,height:y(depth)-y(h1),fill:"#6a4b32",opacity:.13}));
  svg.appendChild(S("line",{x1:L,y1:y(h1),x2:L+pw,y2:y(h1),stroke:"#e6b95b","stroke-dasharray":"6 5"}));svgText(svg,L+pw-4,y(h1)-7,"Cambio de pendiente",{"text-anchor":"end",fill:"#d9b36b","font-size":10});
  const s1=q+G1*h1;svg.appendChild(S("path",{d:`M${x(q)} ${y(0)} L${x(s1)} ${y(h1)} L${x(total)} ${y(depth)}`,fill:"none",stroke:"#26c9ef","stroke-width":5,"stroke-linejoin":"round",filter:"url(#lGlow)"}));
  [[q,0,"q"],[s1,h1,`${s1.toFixed(1)} kPa`],[total,depth,`${total.toFixed(1)} kPa`]].forEach(([sx,sy,label],i)=>{svg.appendChild(S("circle",{cx:x(sx),cy:y(sy),r:i===2?7:6,fill:i===2?"#27d0ef":"#ffb547",stroke:"#071522","stroke-width":3}));if(i>0)svgText(svg,x(sx)+10,y(sy)-9,label,{fill:i===2?"#2dd7f1":"#ffc866","font-size":11,"font-weight":850});});
  svgText(svg,W/2,H-15,"Esfuerzo vertical acumulado",{"text-anchor":"middle",fill:"#c9dae4","font-size":11});
}

// Sobrecarga
const overloadInputs=["q","qGamma","qDepth"].map($);overloadInputs.forEach(el=>el.addEventListener("input",updateOverload));
function updateOverload(){const q=+$("q").value,G=+$("qGamma").value,Z=+$("qDepth").value,soil=G*Z,total=q+soil;$("qOut").textContent=`${q.toFixed(0)} kPa`;$("qGammaOut").textContent=`${G.toFixed(1)} kN/m³`;$("qDepthOut").textContent=`${Z.toFixed(1)} m`;$("qTotalOut").textContent=`${total.toFixed(1)} kPa`;$("qInterpretation").textContent=`${q.toFixed(1)} kPa provienen de la carga superficial y ${soil.toFixed(1)} kPa del peso del suelo.`;drawOverloadScene(q,G,Z,total);drawQChart(q,G,Z,total)}
function drawOverloadScene(q,G,Z,total){
  const svg=$("overloadSceneSvg");svg.innerHTML="";addDefs(svg,soilDefs(14));svgText(svg,215,27,"Terreno con carga superficial",{"text-anchor":"middle",fill:"#edf8ff","font-size":15,"font-weight":850});
  const x=80,y=110,w=270,h=410;svg.appendChild(S("rect",{x,y,width:w,height:h,rx:8,fill:"url(#soilBase)",stroke:"#a67546"}));svg.appendChild(S("rect",{x,y,width:w,height:h,rx:8,filter:"url(#soilTexture)",opacity:.68}));svg.appendChild(S("rect",{x:x-14,y:y+h,width:w+28,height:38,rx:5,fill:"url(#concrete)"}));
  const loadW=105+q/180*150,lx=215-loadW/2;svg.appendChild(S("rect",{x:lx,y:63,width:loadW,height:38,rx:5,fill:"#c7d1d8"}));for(let i=0;i<7;i++){const ax=lx+loadW*(i+1)/8;svg.appendChild(S("line",{x1:ax,y1:29,x2:ax,y2:56,stroke:"#ffae32","stroke-width":4}));svg.appendChild(S("path",{d:`M${ax-6} 50 L${ax} 59 L${ax+6} 50`,fill:"none",stroke:"#ffae32","stroke-width":4}));}
  svgText(svg,215,17,`q = ${q.toFixed(0)} kPa`,{"text-anchor":"middle",fill:"#ffc261","font-size":12,"font-weight":850});const py=y+h*(Z/10);svg.appendChild(S("line",{x1:55,y1:py,x2:x+w+20,y2:py,stroke:"#28d0ee","stroke-dasharray":"6 5","stroke-width":2}));svg.appendChild(S("circle",{cx:x+w,cy:py,r:7,fill:"#28d0ee",stroke:"#fff","stroke-width":2}));svgText(svg,x+w+10,py-7,`z=${Z.toFixed(1)} m`,{fill:"#2bd5f0","font-size":11,"font-weight":850});svgText(svg,215,592,`σᵥ = ${q.toFixed(0)} + ${G.toFixed(1)}(${Z.toFixed(1)}) = ${total.toFixed(1)} kPa`,{"text-anchor":"middle",fill:"#edf8ff","font-size":13,"font-weight":800});
}
function drawQChart(q,G,Z,total){
  const svg=$("chartQ");svg.innerHTML="";const W=670,H=620,L=74,R=28,T=58,B=60,pw=W-L-R,ph=H-T-B,maxX=niceMax(q+G*10,50),x=v=>L+v/maxX*pw,y=v=>T+v/10*ph;addDefs(svg,`<filter id="qGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);svgText(svg,W/2,28,"Comparación de perfiles σᵥ (kPa)",{"text-anchor":"middle",fill:"#edf8ff","font-size":15,"font-weight":850});
  for(let i=0;i<=5;i++){const xv=maxX*i/5;svg.appendChild(S("line",{x1:x(xv),y1:T,x2:x(xv),y2:T+ph,stroke:"#17384e"}));svgText(svg,x(xv),T-12,Math.round(xv),{"text-anchor":"middle","font-size":11});}for(let i=0;i<=10;i++){svg.appendChild(S("line",{x1:L,y1:y(i),x2:L+pw,y2:y(i),stroke:"#17384e"}));svgText(svg,L-11,y(i)+4,i,{"text-anchor":"end","font-size":11});}
  svg.appendChild(S("path",{d:`M${x(0)} ${y(0)} L${x(G*10)} ${y(10)}`,fill:"none",stroke:"#718a9a","stroke-width":3,"stroke-dasharray":"9 7"}));svg.appendChild(S("path",{d:`M${x(q)} ${y(0)} L${x(q+G*10)} ${y(10)}`,fill:"none",stroke:"#28c9ef","stroke-width":5,filter:"url(#qGlow)"}));
  const px=x(total),py=y(Z);svg.appendChild(S("line",{x1:L,y1:py,x2:px,y2:py,stroke:"#ffb547","stroke-dasharray":"6 5"}));svg.appendChild(S("circle",{cx:px,cy:py,r:7,fill:"#ffb547",stroke:"#071522","stroke-width":3}));svgText(svg,px+10,py-10,`${total.toFixed(1)} kPa`,{fill:"#ffc45d","font-size":11,"font-weight":850});
  svg.appendChild(S("line",{x1:x(8),y1:538,x2:x(36),y2:538,stroke:"#718a9a","stroke-width":3,"stroke-dasharray":"8 6"}));svgText(svg,x(39),542,"Sin sobrecarga",{fill:"#9eb2bf","font-size":11});svg.appendChild(S("line",{x1:x(8),y1:562,x2:x(36),y2:562,stroke:"#28c9ef","stroke-width":4}));svgText(svg,x(39),566,"Con sobrecarga",{fill:"#cfe8f2","font-size":11});
}

// Ejemplos guiados
const guidedCases=[
  {tag:"EJEMPLO A",title:"Suelo homogéneo sin sobrecarga",type:"hom",data:["γ = 17.5 kN/m³","z = 4.50 m"],calc:"σᵥ = 17.5 × 4.50",result:"78.8 kPa",interpret:"Cada metro de profundidad añade 17.5 kPa. La recta inicia en cero porque no hay sobrecarga."},
  {tag:"EJEMPLO B",title:"Dos capas con sobrecarga",type:"layers",data:["q = 25.0 kPa","γ₁=16.0; h₁=2.50 m","γ₂=18.0; h₂=3.00 m"],calc:"σᵥ = 25 + 40 + 54",result:"119.0 kPa",interpret:"La sobrecarga se suma una sola vez y cada capa aporta γᵢhᵢ."},
  {tag:"EJEMPLO C",title:"Punto dentro de la segunda capa",type:"partial",data:["q = 40.0 kPa","γ₁=17.5; h₁=1.50 m","γ₂=19.2; z₂=1.80 m"],calc:"σᵥ = 40 + 26.25 + 34.56",result:"100.8 kPa",interpret:"Solo se incluye la fracción de la segunda capa situada por encima del punto de análisis."}
];
let guidedRendered=false;
function renderGuidedExamples(){
  if(guidedRendered)return;guidedRendered=true;
  $("guidedExamples").innerHTML=guidedCases.map((c,i)=>`<article class="guided-example"><header><span>${c.tag}</span><h3>${c.title}</h3></header><svg id="guidedSvg${i}" viewBox="0 0 430 180" aria-label="${c.title}"></svg><div class="guided-body"><div class="guided-data">${c.data.map(d=>`<span><b>Dato:</b> ${d}</span>`).join("")}</div><div class="guided-calc">${c.calc} = <span class="guided-result">${c.result}</span></div><div class="guided-interpret"><b>Interpretación:</b> ${c.interpret}</div></div></article>`).join("");
  guidedCases.forEach((c,i)=>drawGuidedScene($("guidedSvg"+i),c));
}
function drawGuidedScene(svg,c){
  svg.innerHTML="";addDefs(svg,`<filter id="gSoil"><feTurbulence type="fractalNoise" baseFrequency=".07 .2" numOctaves="3" seed="9"/><feColorMatrix values=".5 0 0 0 .15 0 .4 0 0 .1 0 0 .3 0 .05 0 0 0 .55 0"/></filter>`);const x=34,y=26,w=126,h=128;
  if(c.type==="hom"){svg.appendChild(S("rect",{x,y,width:w,height:h,rx:5,fill:"#79502d"}));svg.appendChild(S("rect",{x,y,width:w,height:h,filter:"url(#gSoil)",opacity:.65}));svg.appendChild(S("line",{x1:188,y1:28,x2:188,y2:152,stroke:"#bed0db"}));svg.appendChild(S("line",{x1:188,y1:28,x2:368,y2:145,stroke:"#2acbf0","stroke-width":4}));svgText(svg,279,168,"σᵥ aumenta linealmente",{"text-anchor":"middle","font-size":10});}
  if(c.type==="layers"||c.type==="partial"){svg.appendChild(S("rect",{x,y,width:w,height:55,rx:5,fill:"#a37a47"}));svg.appendChild(S("rect",{x,y:y+55,width:w,height:73,fill:"#5e432e"}));for(let i=0;i<5;i++){const ax=x+18+i*22;svg.appendChild(S("line",{x1:ax,y1:5,x2:ax,y2:22,stroke:"#29ccef","stroke-width":3}));}svg.appendChild(S("line",{x1:188,y1:28,x2:188,y2:152,stroke:"#bed0db"}));svg.appendChild(S("path",{d:`M220 38 L278 78 L${c.type==="partial"?335:365} ${c.type==="partial"?126:150}`,fill:"none",stroke:"#2acbf0","stroke-width":4,"stroke-linejoin":"round"}));svg.appendChild(S("circle",{cx:c.type==="partial"?335:365,cy:c.type==="partial"?126:150,r:5,fill:"#ffb547"}));}
  svg.appendChild(S("rect",{x:x-8,y:154,width:w+16,height:14,rx:3,fill:"#7b858b"}));
}
$("challengeOptions").addEventListener("click",event=>{const btn=event.target.closest("button");if(!btn)return;document.querySelectorAll("#challengeOptions button").forEach(b=>b.classList.remove("correct","wrong"));const ok=btn.dataset.correct==="true";btn.classList.add(ok?"correct":"wrong");$("challengeFeedback").textContent=ok?"Correcto. El esfuerzo total reúne las presiones verticales que actúan sobre el punto.":"Revisa: el esfuerzo no es volumen, resistencia ni una función exclusiva de la profundidad.";});

// Modelación
function drawModel(){
  const svg=$("modelSvg");svg.innerHTML="";addDefs(svg,`<linearGradient id="mConcrete" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d4dbe0"/><stop offset=".5" stop-color="#929fa8"/><stop offset="1" stop-color="#5c6870"/></linearGradient><linearGradient id="mSoil" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#755035"/><stop offset="1" stop-color="#291a14"/></linearGradient><filter id="mShadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-opacity=".38"/></filter><linearGradient id="mHeat" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e53d3d"/><stop offset=".3" stop-color="#f0872e"/><stop offset=".55" stop-color="#e6c33d"/><stop offset=".78" stop-color="#32a579"/><stop offset="1" stop-color="#285bc8"/></linearGradient>`);
  svg.appendChild(S("rect",{x:70,y:330,width:760,height:225,rx:18,fill:"url(#mSoil)"}));
  const colors=["#285bc8","#32a579","#e6c33d","#f0872e","#e53d3d"];colors.forEach((c,i)=>{const rx=280-i*39,ry=180-i*27;svg.appendChild(S("ellipse",{cx:450,cy:390,rx,ry,fill:c,opacity:.14+i*.025}));svg.appendChild(S("path",{d:`M${450-rx} 334 C${450-rx*.78} ${360+ry*.2},${450-rx*.42} ${360+ry*.75},450 ${350+ry} C${450+rx*.42} ${360+ry*.75},${450+rx*.78} ${360+ry*.2},${450+rx} 334`,fill:"none",stroke:c,"stroke-width":5,opacity:.88}));});
  svg.appendChild(S("polygon",{points:"290,272 610,272 690,330 210,330",fill:"url(#mConcrete)",filter:"url(#mShadow)"}));svg.appendChild(S("polygon",{points:"210,330 690,330 650,382 250,382",fill:"#727f87"}));svg.appendChild(S("polygon",{points:"380,102 520,102 560,132 340,132",fill:"#b9c4ca"}));svg.appendChild(S("rect",{x:340,y:132,width:220,height:140,fill:"url(#mConcrete)"}));
  svg.appendChild(S("line",{x1:450,y1:45,x2:450,y2:248,stroke:"#ffad32","stroke-width":12,"stroke-linecap":"round"}));svg.appendChild(S("path",{d:"M430 230 L450 260 L470 230",fill:"#ffad32"}));svgText(svg,474,72,"P = 900 kN",{fill:"#ffc35d","font-size":17,"font-weight":850});
  for(let i=0;i<8;i++){const ax=270+i*52;svg.appendChild(S("line",{x1:ax,y1:340,x2:ax,y2:382+(3-Math.abs(3.5-i)) * 8,stroke:"#56da91","stroke-width":5}));svg.appendChild(S("path",{d:`M${ax-6} ${372+(3-Math.abs(3.5-i))*8} L${ax} ${382+(3-Math.abs(3.5-i))*8} L${ax+6} ${372+(3-Math.abs(3.5-i))*8}`,fill:"none",stroke:"#56da91","stroke-width":4}));}
  svg.appendChild(S("line",{x1:240,y1:406,x2:660,y2:406,stroke:"#c8d6de","stroke-width":2}));svg.appendChild(S("path",{d:"M240 398 L225 406 L240 414 M660 398 L675 406 L660 414",fill:"none",stroke:"#c8d6de","stroke-width":2}));svgText(svg,450,428,"3.0 m",{"text-anchor":"middle",fill:"#eaf4f9","font-size":14,"font-weight":800});svgText(svg,720,350,"2.5 m",{fill:"#eaf4f9","font-size":14,"font-weight":800,transform:"rotate(-34 720 350)"});
}
const answerArea=$("answerArea"),answerStress=$("answerStress"),modelFeedback=$("modelFeedback");
$("checkModel").addEventListener("click",()=>{const A=Number(String(answerArea.value).replace(",",".")),Sg=Number(String(answerStress.value).replace(",",".")),okA=Math.abs(A-7.5)<.06,okS=Math.abs(Sg-120)<.2;modelFeedback.className=`model-feedback ${okA&&okS?"ok":"bad"}`;modelFeedback.innerHTML=okA&&okS?"<b>Correcto.</b> A = 7.5 m² y σ = 120 kPa. Esto significa que cada metro cuadrado transmite, en promedio, 120 kN al terreno.":`<b>Revisa el procedimiento.</b> ${!okA?"El área se obtiene multiplicando 3.0 × 2.5. ":""}${!okS?"Luego divide 900 kN entre el área calculada.":""}`;});

// PWA, instalación y estado de red
let deferredPrompt=null;const installBtn=$("installBtn");
window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();deferredPrompt=event;installBtn.hidden=false});
installBtn.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();const choice=await deferredPrompt.userChoice;if(choice.outcome==="accepted")showToast("La aplicación se está instalando.");deferredPrompt=null;installBtn.hidden=true});
window.addEventListener("appinstalled",()=>{installBtn.hidden=true;showToast("Aplicación instalada correctamente.")});
function updateOnline(){const online=navigator.onLine,status=$("onlineStatus");status.classList.toggle("offline",!online);status.innerHTML=`<span></span>${online?"En línea":"Sin conexión"}`;}
window.addEventListener("online",updateOnline);window.addEventListener("offline",updateOnline);updateOnline();
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").then(reg=>{reg.addEventListener("updatefound",()=>showToast("Hay una actualización disponible; se aplicará al volver a abrir."));}).catch(()=>showToast("No se pudo activar el modo sin conexión.")))}

// Inicialización
renderPACases();renderGuidedExamples();updateIntro();updatePA();updateDepth();updateLayers();updateOverload();drawModel();showScreen(0);
