import './style.css';
import { getCurrentWindow } from '@tauri-apps/api/window';

const app = document.querySelector('#app');
const win = window.__TAURI_INTERNALS__ ? getCurrentWindow() : null;
const initial = {page:'home',scene:'Gaming',light:'Gaming',shade:'Beschatten',pinned:false,printer:'running',washer:'running',server:'ok'};
const state={...initial};
const scenes=['Ambient','Gaming','Hell','Aus'];
const icons={home:'⌂',smart:'☷',pin:'♧'};
const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function device(title,kind){
 const val=state[kind]; const running=val==='running'; const done=val==='done';
 const pct=running?(kind==='printer'?64:72):done?100:0;
 const time=running?(kind==='printer'?'1h 12m':'48 min'):done?'Fertig':'Bereit';
 const status=running?(kind==='printer'?'Druck läuft':'Waschgang läuft'):done?(kind==='printer'?'Druck fertig':'Wäsche fertig'):(kind==='printer'?'Kein Druck':'Standby');
 return `<section class="device"><div class="device-name">${title}</div><div class="device-time">${time}</div><div class="progress"><div class="fill ${kind}" style="width:${pct}%"></div></div><div class="device-status">${pct}% · ${status}</div></section>`;
}
function render(){
 const status={ok:['●','UNRAID OK'],warning:['▲','UNRAID WARNUNG'],offline:['●','UNRAID OFFLINE']}[state.server];
 app.innerHTML=`<div class="shell">
 <header class="topbar"><div class="brand" data-drag>◈ DESKDECK <span class="page-name">/ ${state.page==='home'?'HOME':'SMART HOME'}</span></div>
 <div class="right"><span class="server ${state.server}" title="Demo-Status; rechtsklicken zum Ändern">${status[0]} ${status[1]}</span><button class="winbtn ${state.pinned?'pinned':''}" data-action="pin" title="Immer im Vordergrund">⌖</button><button class="winbtn" data-action="min" title="Minimieren">−</button><button class="winbtn close" data-action="close" title="Schließen">×</button></div></header>
 <div class="content"><nav><button class="navbtn ${state.page==='home'?'active':''}" data-page="home" title="Home">⌂</button><button class="navbtn ${state.page==='smart'?'active':''}" data-page="smart" title="Smart Home">☷</button></nav>
 <main>${state.page==='home'?`<section class="scenes"><button class="scene ${state.scene==='Gaming'?'selected':''}" data-scene="Gaming"><span>⌘</span> Gaming</button><button class="scene ${state.scene==='Ambient'?'selected':''}" data-scene="Ambient"><span>☀</span> Ambient</button></section>${device('BAMBU P2S','printer')}${device('MIELE','washer')}`:`<section class="light-panel"><div class="panel-heading">☀ &nbsp; LICHTSZENE</div><button class="light-switch" data-action="light"><span>↻</span> ${escapeHTML(state.light)}</button></section><section class="shade-panel"><div class="panel-heading">▤ &nbsp; RAFFSTORES</div><div class="shade-buttons">${[['Auf','↑'],['Beschatten','☀'],['Zu','↓']].map(([name,symbol])=>`<button class="shade ${state.shade===name?'selected':''}" data-shade="${name}"><span>${symbol}</span><small>${name}</small></button>`).join('')}</div></section>`}</main></div>
 </div><div id="demo-hint">DEMO · Keine Geräte verbunden <button id="demo-toggle">Teststatus ▾</button></div><div id="demo-controls" hidden><label>Unraid <select data-setting="server"><option value="ok">OK</option><option value="warning">Warnung</option><option value="offline">Offline</option></select></label><label>Bambu <select data-setting="printer"><option value="running">Druck läuft</option><option value="done">Fertig</option><option value="idle">Bereit</option></select></label><label>Miele <select data-setting="washer"><option value="running">Waschgang läuft</option><option value="done">Fertig</option><option value="idle">Standby</option></select></label></div>`;
 document.querySelectorAll('[data-setting]').forEach(el=>el.value=state[el.dataset.setting]);
}
render();
app.addEventListener('click',async e=>{
 const el=e.target.closest('button');if(!el)return;
 if(el.id==='demo-toggle'){document.querySelector('#demo-controls').hidden=!document.querySelector('#demo-controls').hidden;return}
 if(el.dataset.page)state.page=el.dataset.page;
 if(el.dataset.scene){state.scene=el.dataset.scene;state.light=el.dataset.scene;}
 if(el.dataset.shade)state.shade=el.dataset.shade;
 if(el.dataset.action==='light')state.light=scenes[(scenes.indexOf(state.light)+1)%scenes.length];
 if(el.dataset.action==='pin'){state.pinned=!state.pinned;if(win)await win.setAlwaysOnTop(state.pinned);}
 if(el.dataset.action==='close'){if(win)await win.close();else window.close();return}
 if(el.dataset.action==='min'){if(win)await win.minimize();return}
 const expanded=!document.querySelector('#demo-controls').hidden;
 render();document.querySelector('#demo-controls').hidden=!expanded;
});
app.addEventListener('change',e=>{if(e.target.dataset.setting){state[e.target.dataset.setting]=e.target.value;render();document.querySelector('#demo-controls').hidden=false}});
app.addEventListener('mousedown',e=>{if(e.button===0&&e.target.closest('[data-drag]')&&win)win.startDragging().catch(()=>{});});
