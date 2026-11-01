use std::{fs, sync::{Arc,Mutex}, path::PathBuf};
use tauri::{Manager, PhysicalPosition, Emitter, tray::{TrayIconBuilder,TrayIconEvent,MouseButton,MouseButtonState}};
use serde::{Serialize,Deserialize};
use loxwebsocket::{ConnectConfig,LoxClient,LoxHandler,LoxoneUuid,TlsMode};

#[derive(Clone,Serialize,Deserialize)]
#[serde(rename_all="camelCase")]
struct Settings { address:String, username:String, control_uuid:String, active_moods_uuid:String, gaming_id:u32, ambient_id:u32 }
impl Default for Settings {fn default()->Self{Self{address:String::new(),username:String::new(),control_uuid:String::new(),active_moods_uuid:String::new(),gaming_id:3,ambient_id:99}}}
#[derive(Clone,Serialize)]
#[serde(rename_all="camelCase")]
struct Update {connected:bool, moods:Option<Vec<u32>>, error:Option<String>}
struct Handler {app:tauri::AppHandle, mood_uuid:String}
impl LoxHandler for Handler {
    fn on_text(&mut self, uuid:&LoxoneUuid, text:&str, _icon:&LoxoneUuid) {
        if uuid.to_string().eq_ignore_ascii_case(&self.mood_uuid) {
            let moods=serde_json::from_str::<Vec<u32>>(text).ok();
            let _=self.app.emit("loxone-update",Update{connected:true,moods,error:None});
        }
    }
}
type Client=LoxClient<Handler>;
struct AppState {client:tokio::sync::Mutex<Option<Client>>, settings:Mutex<Settings>, _runtime:tokio::runtime::Runtime}
fn settings_path(app:&tauri::AppHandle)->Result<PathBuf,String>{let dir=app.path().app_config_dir().map_err(|e|e.to_string())?;fs::create_dir_all(&dir).map_err(|e|e.to_string())?;Ok(dir.join("settings.json"))}
fn credential()->Result<keyring::Entry,String>{keyring::Entry::new("DeskDeck.Loxone","miniserver").map_err(|e|e.to_string())}
#[tauri::command]
fn load_settings(state:tauri::State<'_,Arc<AppState>>)->Settings{state.settings.lock().unwrap().clone()}
#[tauri::command]
fn save_settings(app:tauri::AppHandle,state:tauri::State<'_,Arc<AppState>>,settings:Settings,password:Option<String>)->Result<(),String>{
 if settings.address.trim().is_empty()||settings.username.trim().is_empty(){return Err("Adresse und Benutzername fehlen".into())}
 if !settings.address.starts_with("https://"){return Err("Bitte eine HTTPS-Adresse angeben (z. B. https://192.168.1.10)".into())}
 if !settings.control_uuid.is_empty()&&!settings.control_uuid.chars().all(|c|c.is_ascii_hexdigit()||c=='-'){return Err("Ungültige Baustein-UUID".into())}
 if !settings.active_moods_uuid.is_empty()&&!settings.active_moods_uuid.chars().all(|c|c.is_ascii_hexdigit()||c=='-'){return Err("Ungültige Status-UUID".into())}
 if let Some(p)=password{if !p.is_empty(){credential()?.set_password(&p).map_err(|e|e.to_string())?;}}
 let content=serde_json::to_vec_pretty(&settings).map_err(|e|e.to_string())?;
 fs::write(settings_path(&app)?,content).map_err(|e|e.to_string())?;
 *state.settings.lock().unwrap()=settings;Ok(())
}
#[tauri::command]
async fn connect_loxone(app:tauri::AppHandle,state:tauri::State<'_,Arc<AppState>>)->Result<(),String>{
 let settings=state.settings.lock().unwrap().clone();
 if settings.active_moods_uuid.trim().is_empty(){return Err("UUID des activeMoods-Status fehlt".into())}
 let password=credential()?.get_password().map_err(|_|"Bitte Passwort in den Einstellungen speichern".to_string())?;
 let mut cfg=ConnectConfig::new(&settings.address,&settings.username,&password);
 cfg.tls=TlsMode::PinOnFirstUse;
 let handler=Handler{app:app.clone(),mood_uuid:settings.active_moods_uuid.clone()};
 let client=LoxClient::connect(cfg,handler).await.map_err(|e|e.to_string())?;
 let mut guard=state.client.lock().await;
 if let Some(old)=guard.take(){let _=old.stop().await;}
 *guard=Some(client);
 let _=app.emit("loxone-update",Update{connected:true,moods:None,error:None});Ok(())
}
#[tauri::command]
async fn set_scene(state:tauri::State<'_,Arc<AppState>>,scene:String)->Result<(),String>{
 let s=state.settings.lock().unwrap().clone();
 let id=match scene.as_str(){"Gaming"=>s.gaming_id,"Ambient"=>s.ambient_id,_=>return Err("Unbekannte Szene".into())};
 if s.control_uuid.is_empty(){return Err("Lichtbaustein-UUID fehlt".into())}
 let guard=state.client.lock().await;
 let client=guard.as_ref().ok_or("Keine Loxone-Verbindung")?;
 if !client.live(){return Err("Loxone ist offline".into())}
 client.send_control(&s.control_uuid,&format!("setMoodToId/{id}")).await.map_err(|e|e.to_string())
}
#[tauri::command]
async fn connection_status(state:tauri::State<'_,Arc<AppState>>)->Result<bool,String>{let guard=state.client.lock().await;Ok(guard.as_ref().map(|c|c.live()).unwrap_or(false))}
fn toggle_popup(app:&tauri::AppHandle){let Some(w)=app.get_webview_window("main") else{return};if w.is_visible().unwrap_or(false){let _=w.hide();return;}if let Ok(Some(m))=w.primary_monitor(){let a=m.work_area();if let Ok(s)=w.outer_size(){let x=a.position.x+a.size.width as i32-s.width as i32-12;let y=a.position.y+a.size.height as i32-s.height as i32-10;let _=w.set_position(PhysicalPosition::new(x.max(a.position.x),y.max(a.position.y)));}}let _=w.show();let _=w.set_focus();}
#[cfg_attr(mobile,tauri::mobile_entry_point)]
pub fn run(){let runtime=tokio::runtime::Builder::new_multi_thread().enable_all().build().expect("tokio runtime");
 tauri::Builder::default()
 .setup(|app|{
  let settings=settings_path(app.handle()).ok().and_then(|p|fs::read_to_string(p).ok()).and_then(|v|serde_json::from_str(&v).ok()).unwrap_or_default();
  app.manage(Arc::new(AppState{client:tokio::sync::Mutex::new(None),settings:Mutex::new(settings),_runtime:runtime}));
  let icon=app.default_window_icon().expect("DeskDeck icon missing").clone();
  TrayIconBuilder::new().icon(icon).tooltip("DeskDeck – klicken zum Öffnen").show_menu_on_left_click(false)
   .on_tray_icon_event(|tray,event|{if let TrayIconEvent::Click{button:MouseButton::Left,button_state:MouseButtonState::Up,..}=event{toggle_popup(tray.app_handle());}}).build(app)?;
  Ok(())
 })
 .invoke_handler(tauri::generate_handler![load_settings,save_settings,connect_loxone,set_scene,connection_status])
 .on_window_event(|w,e|{if let tauri::WindowEvent::Focused(false)=e{let _=w.hide();}if let tauri::WindowEvent::CloseRequested{api,..}=e{api.prevent_close();let _=w.hide();}})
 .run(tauri::generate_context!()).expect("DeskDeck error");}
