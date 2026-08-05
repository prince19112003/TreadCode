use systemstat::Platform;

#[tauri::command]
fn get_hwid() -> String {
  let sys = systemstat::System::new();
  if let Ok(networks) = sys.networks() {
    for net in networks.values() {
      if !net.addrs.is_empty() {
        return format!("{:?}", net.name);
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
