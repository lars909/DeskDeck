import './style.css';
import { getCurrentWindow } from '@tauri-apps/api/window';

const win = window.__TAURI_INTERNALS__ ? getCurrentWindow() : null;
const app = document.querySelector('#app');
const state = { page: 'home', scene: 'Gaming', light: 'Gaming', shade: 'Beschatten', printer: 'running', washer: 'running', server: 'ok' };
const scenes = ['Ambient', 'Gaming', 'Hell', 'Aus'];
const icons = {
  home: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
  smart: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16M8 5v4M16 10v4M10 15v4"/></svg>'
};
const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function device(title, kind) {
  const val=state[kind], running=val==='running', done=val==='done';
  const pct=running?(kind==='printer'?62:38):done?100:0;
  const time=running?(kind==='printer'?'1h 12m':'48 min'):done?'Fertig':'Bereit';
  const status=running?(kind==='printer'?'Druck läuft':'Waschgang läuft'):done?(kind==='printer'?'Druck fertig':'Wäsche fertig'):(kind==='printer'?'Kein Druck':'Standby');
  return `<section class="device"><div class="device-name">${title}</div><div class="device-time">${time}</div><div class="progress"><div class="fill ${kind}" style="width:${pct}%"></div></div><div class="device-status">${status} <span>· ${pct} %</span></div></section>`;
}
function render() {
  const status={ok:['●','Unraid online'],warning:['●','Unraid Warnung'],offline:['●','Unraid offline']}[state.server];
  app.innerHTML=`<div class="shell"><header class="header" data-drag><div class="logo"><span class="logo-mark">◈</span> DeskDeck <span class="section-label">/ ${state.page==='home'?'Home':'Smart Home'}</span></div><div class="server ${state.server}"><span>${status[0]}</span> ${status[1]}</div></header><div class="body"><nav><button class="navbtn ${state.page==='home'?'active':''}" data-page="home" title="Home">${icons.home}</button><button class="navbtn ${state.page==='smart'?'active':''}" data-page="smart" title="Smart Home">${icons.smart}</button></nav><main>${state.page==='home'?`<div class="home-content"><div class="scenes"><button class="scene ${state.scene==='Gaming'?'selected':''}" data-scene="Gaming"><span>⌘</span> Gaming</button><button class="scene ${state.scene==='Ambient'?'selected':''}" data-scene="Ambient"><span>☀</span> Ambient</button></div>${device('Bambu Lab P2S','printer')}${device('Miele','washer')}</div>`:`<div class="smart-content"><section class="panel lighting"><div class="panel-title">LICHTSZENE</div><button class="light-switch" data-action="light"><span>◉</span><strong>${escapeHTML(state.light)}</strong><small>Klicken zum Wechseln ↻</small></button></section><section class="panel blinds"><div class="panel-title">RAFFSTORES</div><div class="shade-buttons">${[['Auf','↑'],['Beschatten','☀'],['Zu','↓']].map(([name,symbol])=>`<button class="shade ${state.shade===name?'selected':''}" data-shade="${name}"><span>${symbol}</span><small>${name}</small></button>`).join('')}</div></section></div>`}</main></div><footer><span>DEMO · Noch keine Geräte verbunden</span><button id="demo-toggle">Teststatus <span>⌄</span></button></footer></div><div id="demo-controls" hidden><label>Unraid <select data-setting="server"><option value="ok">Online</option><option value="warning">Warnung</option><option value="offline">Offline</option></select></label><label>Bambu <select data-setting="printer"><option value="running">Druck läuft</option><option value="done">Fertig</option><option value="idle">Bereit</option></select></label><label>Miele <select data-setting="washer"><option value="running">Waschgang läuft</option><option value="done">Fertig</option><option value="idle">Standby</option></select></label><button data-action="hide">Schließen</button></div>`;
  document.querySelectorAll('[data-setting]').forEach(el=>el.value=state[el.dataset.setting]);
}
render();
app.addEventListener('click',async e=>{
  const el=e.target.closest('button'); if(!el)return;
  if(el.id==='demo-toggle'){document.querySelector('#demo-controls').hidden=!document.querySelector('#demo-controls').hidden;return;}
  if(el.dataset.action==='hide'){document.querySelector('#demo-controls').hidden=true;return;}
  if(el.dataset.page)state.page=el.dataset.page;
  if(el.dataset.scene){state.scene=el.dataset.scene;state.light=el.dataset.scene;}
  if(el.dataset.shade)state.shade=el.dataset.shade;
  if(el.dataset.action==='light')state.light=scenes[(scenes.indexOf(state.light)+1)%scenes.length];
  const expanded=!document.querySelector('#demo-controls').hidden;
  render();document.querySelector('#demo-controls').hidden=!expanded;
});
app.addEventListener('change',e=>{if(e.target.dataset.setting){state[e.target.dataset.setting]=e.target.value;render();document.querySelector('#demo-controls').hidden=false;}});
app.addEventListener('mousedown',e=>{if(e.button===0&&e.target.closest('[data-drag]')&&win)win.startDragging().catch(()=>{});});
