use tauri::{Manager, PhysicalPosition, tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState}};

fn toggle_popup(app: &tauri::AppHandle) {
    let Some(window) = app.get_webview_window("main") else { return; };
    if window.is_visible().unwrap_or(false) {
        let _ = window.hide();
        return;
    }
    // Place the popup above the right edge of the primary monitor's usable work area.
    // This respects the Windows taskbar (including its position and scaling).
    if let Ok(Some(monitor)) = window.primary_monitor() {
        let area = monitor.work_area();
        if let Ok(size) = window.outer_size() {
            let x = area.position.x + area.size.width as i32 - size.width as i32 - 12;
            let y = area.position.y + area.size.height as i32 - size.height as i32 - 10;
            let _ = window.set_position(PhysicalPosition::new(x.max(area.position.x), y.max(area.position.y)));
        }
    }
    let _ = window.show();
    let _ = window.set_focus();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let icon = app.default_window_icon().expect("DeskDeck icon missing").clone();
            TrayIconBuilder::new()
                .icon(icon)
                .tooltip("DeskDeck – klicken zum Öffnen")
                .show_menu_on_left_click(false)
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = event {
                        toggle_popup(tray.app_handle());
                    }
                })
                .build(app)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Focused(false) = event {
                let _ = window.hide();
            }
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running DeskDeck");
}
