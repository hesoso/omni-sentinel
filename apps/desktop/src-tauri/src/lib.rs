//! Omni-Sentinel 桌面应用入口
//! 基于 Tauri 2.0 实现跨平台桌面外壳

use tauri_plugin_notification::NotificationExt;

/// 系统通知命令
/// 向操作系统发送原生通知
#[tauri::command]
fn show_notification(app: tauri::AppHandle, title: String, body: String) -> Result<(), String> {
    app.notification()
        .builder()
        .title(&title)
        .body(&body)
        .show()
        .map_err(|e| e.to_string())
}

/// 获取应用版本
#[tauri::command]
fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![show_notification, get_version])
        .run(tauri::generate_context!())
        .expect("启动 Tauri 应用时发生错误");
}
