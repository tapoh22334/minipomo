#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::sync::mpsc;

mod voice_store;
mod sound_coordinator;
mod ticker_core;

use tauri::Manager;
use crate::sound_coordinator::{SoundControl, VoiceIndex};
use crate::ticker_core::{TickerControl, TickerStateNotice, NotificationType};

#[tauri::command]
fn cmd_set_play(secs: u32, tx: tauri::State<mpsc::SyncSender<TickerControl>>) {
    tx.send(TickerControl::Play(secs)).unwrap();
}

#[tauri::command]
fn cmd_set_stop(tx: tauri::State<mpsc::SyncSender<TickerControl>>) {
    tx.send(TickerControl::Stop).unwrap();
}

#[tauri::command]
fn cmd_set_reset(tx: tauri::State<mpsc::SyncSender<TickerControl>>) {
    tx.send(TickerControl::Reset).unwrap();
}

#[tauri::command]
fn cmd_set_notification(notification: String, index: u32, tx: tauri::State<mpsc::SyncSender<TickerControl>>) {
    println!("main: notification {:?}", notification);
    println!("main: index {:?}", index);
    if notification == "voice" {
        tx.send(TickerControl::Notification(NotificationType::VoiceSound(VoiceIndex::try_from(index).unwrap()))).unwrap();
    } else if notification == "sound" {
        tx.send(TickerControl::Notification(NotificationType::Sound)).unwrap();
    } else if notification == "toast" {
        tx.send(TickerControl::Notification(NotificationType::Toast)).unwrap();
    }
}

#[tauri::command]
fn cmd_play_voice(notification: String, index: u32, tx: tauri::State<mpsc::SyncSender<SoundControl>>) {
    println!("{:?}", index);
    if notification == "voice" {
        tx.send(SoundControl::PlayVoiceSound(VoiceIndex::try_from(index).unwrap())).unwrap();
    } else if notification == "sound" {
        tx.send(SoundControl::PlaySound).unwrap();
    } else if notification == "toast" {
    }
}

fn start_emitter(rx: mpsc::Receiver<TickerStateNotice>, app_handle: tauri::AppHandle) {
    std::thread::spawn(move || {
        loop {
            match rx.recv() {
                Ok(msg) => {
                    match msg {
                        TickerStateNotice::Position(n) => {
                            app_handle
                                .emit_all("currentTime", n)
                                .unwrap();

                            println!("Main: position {:?}", n);
                        },

                        TickerStateNotice::Stop => {
                            println!("Main: stopped");
                            app_handle
                                .emit_all("startState", "")
                                .unwrap();

                            println!("Main: stop");
                        },
                    }
                },

                Err(_) => {
                    println!("Main: Failed to receive");
                    break;
                }
            }
        }
        println!("Main: thread stopped");
    });

}

fn main() {
    let context = tauri::generate_context!();

    let sound_coordinator_tx : mpsc::SyncSender<SoundControl> = sound_coordinator::start();

    let identifier = &context.config().tauri.bundle.identifier;
    let (ticker_control_tx, state_notice_rx)
        : (mpsc::SyncSender<TickerControl>, mpsc::Receiver<TickerStateNotice>)
           = ticker_core::start(sound_coordinator_tx.clone(), (&identifier).to_string());


    let app = tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            main_window
                .set_size(tauri::Size::Logical(tauri::LogicalSize {
                    width: 74.0,
                    //width: 200.0,
                    height: 196.0,
                }))
            .unwrap();

            start_emitter(state_notice_rx, app.app_handle());

            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }

            Ok(())
        });
    let app = app.manage(sound_coordinator_tx);
    let app = app.manage(ticker_control_tx);
    let app = app.invoke_handler(
        tauri::generate_handler![
            cmd_set_play,
            cmd_set_stop,
            cmd_set_reset,
            cmd_set_notification,
            cmd_play_voice,
        ]);
    let app = app.run(context)
        .expect("error while running tauri application");

}
