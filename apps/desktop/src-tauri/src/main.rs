//! Tauri 应用主入口

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    omni_sentinel_lib::run()
}
