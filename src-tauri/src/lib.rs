#[tauri::command]
fn get_hwid() -> String {
  // Simple unique fingerprint using target system information
  if let Ok(interfaces) = systemstat::System::new().networks() {
    for (_, interface) in interfaces {
      if !interface.addrs.is_empty() {
        return interface.name; // Use network interface name as unique ID
      }
    }
  }
  "fallback-device-id-xxxx".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_hwid])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
