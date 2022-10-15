#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
        let main_window = app.get_window("main").unwrap();
        main_window
            .set_size(tauri::Size::Logical(tauri::LogicalSize {
                //width: 85.0,
                width: 200.0,
                height: 200.0,
            }))
                .unwrap();

        #[cfg(debug_assertions)] // only include this code on debug builds
        {
            let window = app.get_window("main").unwrap();
            window.open_devtools();
            window.close_devtools();
        }

        Ok(())
    })
    //.plugin(tauri_plugin_window_state::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
