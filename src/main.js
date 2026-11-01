import './style.css';
import { getCurrentWindow } from '@tauri-apps/api/window';

const win = window.__TAURI_INTERNALS__ ? getCurrentWindow() : null;
const app = document.querySelector('#app');
const state = { scene:'Ambient', blind:'Beschatten', sleep:true, printer:'running', washer:'running', server:'ok' };
const svg = (name) => ({
  up:'<path d="M12 19V5m-7 7 7-7 7 7"/>',
  down:'<path d="M12 5v14m-7-7 7 7 7-7"/>',
  shade:'<path d="M4 5h16M5 9h14M6 13h12M7 17h10M9 21h6"/>',
  moon:'<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/>',
  game:'<path d="M6 9h12a4 4 0 0 1 3.7 2.5l1 5a2 2 0 0 1-3.2 2l-3.2-2.5H7.7l-3.2 2.5a2 2 0 0 1-3.2-2l1-5A4 4 0 0 1 6 9Z"/><path d="M7 12v5m-2.5-2.5h5M16.5 13h.01M19 15h.01"/>',
  lamp:'<path d="M5 12h14l-2-7H7l-2 7Zm7 0v7m-4 0h8"/>',
  printer:'<path d="M5 9V4h14v5M5 18H3V9h18v9h-2M6 14h12v7H6zM17 12h.01"/>',
  washer:'<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="5"/><path d="M7 6h.01M11 6h.01M15 6h2"/>'
})[name];
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${svg(name)}</svg>`;
function device(title, kind, glyph) {
  const val=state[kind], running=val==='running', done=val==='done';
  const pct=running?(kind==='printer'?62:38):done?100:0;
  const time=running?(kind==='printer'?'1h 12m':'48 min'):done?'Fertig':'Bereit';
  const status=running?(kind==='printer'?'Druck läuft':'Waschgang läuft'):done?(kind==='printer'?'Druck abgeschlossen':'Waschgang beendet'):(kind==='printer'?'Kein Druck':'Standby');
  return `<section class="device"><div class="device-name">${icon(glyph)}<span>${title}</span></div><div class="device-time">${time}</div><div class="progress"><div class="fill ${kind}" style="width:${pct}%"></div></div><div class="device-status">${status}${running?' · '+pct+' %':''}</div></section>`;
}
function render() {
  const status={ok:'Unraid online',warning:'Unraid Warnung',offline:'Unraid offline'}[state.server];
  app.innerHTML=`<div class="shell"><header class="header" data-drag><div class="logo"><span class="logo-mark">◈</span> DeskDeck</div><div class="header-status"><div class="sleep ${state.sleep?'active':'inactive'}" title="Schlafmodus Schlafzimmer: ${state.sleep?'aktiv':'inaktiv'}">${icon('moon')}<span>Schlafmodus ${state.sleep?'an':'aus'}</span></div><div class="server ${state.server}"><span class="dot"></span>${status}</div></div></header><main class="dashboard"><section class="scenes"><button class="scene ${state.scene==='Gaming'?'selected':''}" data-scene="Gaming">${icon('game')}<span>Gaming</span></button><button class="scene ${state.scene==='Ambient'?'selected':''}" data-scene="Ambient">${icon('lamp')}<span>Ambient</span></button></section><section class="blinds"><div class="panel-title">ROLLLADEN</div><div class="blind-grid"><button class="blind-btn ${state.blind==='Auf'?'selected':''}" data-blind="Auf" title="Rollladen hoch" aria-label="Rollladen hoch">${icon('up')}</button><button class="blind-btn ${state.blind==='Zu'?'selected':''}" data-blind="Zu" title="Rollladen runter" aria-label="Rollladen runter">${icon('down')}</button><button class="blind-btn shade ${state.blind==='Beschatten'?'selected':''}" data-blind="Beschatten" title="Beschatten">${icon('shade')}<span>Beschatten</span></button></div></section>${device('Bambu Lab P2S','printer','printer')}${device('Miele','washer','washer')}</main><footer><span>DEMO · Noch keine Geräte verbunden</span><button id="demo-toggle">Teststatus ▾</button></footer></div><div id="demo-controls" hidden><label>Unraid<select data-setting="server"><option value="ok">Online</option><option value="warning">Warnung</option><option value="offline">Offline</option></select></label><label>Schlafmodus<select data-setting="sleep"><option value="true">An</option><option value="false">Aus</option></select></label><label>Bambu<select data-setting="printer"><option value="running">Druck läuft</option><option value="done">Fertig</option><option value="idle">Bereit</option></select></label><label>Miele<select data-setting="washer"><option value="running">Waschgang läuft</option><option value="done">Fertig</option><option value="idle">Standby</option></select></label><button data-action="hide">Schließen</button></div>`;
  document.querySelectorAll('[data-setting]').forEach(el=>el.value=String(state[el.dataset.setting]));
}
render();
app.addEventListener('click',e=>{
  const el=e.target.closest('button'); if(!el)return;
  if(el.id==='demo-toggle'){document.querySelector('#demo-controls').hidden=!document.querySelector('#demo-controls').hidden;return;}
  if(el.dataset.action==='hide'){document.querySelector('#demo-controls').hidden=true;return;}
  if(el.dataset.scene)state.scene=el.dataset.scene;
  if(el.dataset.blind)state.blind=el.dataset.blind;
  const expanded=!document.querySelector('#demo-controls').hidden;
  render();document.querySelector('#demo-controls').hidden=!expanded;
});
app.addEventListener('change',e=>{if(e.target.dataset.setting){const k=e.target.dataset.setting;state[k]=k==='sleep'?e.target.value==='true':e.target.value;render();document.querySelector('#demo-controls').hidden=false;}});
app.addEventListener('mousedown',e=>{if(e.button===0&&e.target.closest('[data-drag]')&&win)win.startDragging().catch(()=>{});});
