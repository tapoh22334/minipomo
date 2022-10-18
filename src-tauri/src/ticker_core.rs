use tauri;
use std::time::{Duration, Instant};
use std::sync::mpsc::{RecvTimeoutError};
use std::sync::mpsc;
use crate::sound_coordinator::{SoundControl, VoiceIndex};

#[derive(Debug)]
pub enum NotificationType {
    VoiceSound(VoiceIndex),
    Sound,
    Toast,
}

pub enum TickerControl {
    Play(u32),
    Stop,
    Reset,
    Notification(NotificationType),
}

pub enum TickerStateNotice {
    Position(u32),
    Stop,
}

pub fn start(sound_control: mpsc::SyncSender<SoundControl>, identifier: String)
    -> (mpsc::SyncSender<TickerControl>, mpsc::Receiver<TickerStateNotice>) {

    let (ticker_control_tx, ticker_control_rx) 
        = mpsc::sync_channel::<TickerControl>(1);

    let (ticker_notice_tx, ticker_notice_rx)
        = mpsc::sync_channel::<TickerStateNotice>(1);

    let tick = Duration::from_millis(200);
    let mut start_time: Option<Instant> = None;
    let mut spend: Duration = Duration::from_secs(0);
    let mut duration: Option<Duration> = None;
    let mut notification: Option<NotificationType> = None;

    std::thread::spawn(move || {
        loop {
            match ticker_control_rx.recv_timeout(tick) {
                Ok(msg) => {
                    match msg {
                        TickerControl::Play(duration_sec) => {
                            start_time = Some(Instant::now());
                            spend = Duration::from_secs(0);
                            duration = Some(Duration::from_secs(duration_sec.into()));
                            println!("ticker_core: recv Play {:?}", duration);
                        }

                        TickerControl::Stop => {
                            spend = spend + start_time.unwrap().elapsed();
                            start_time = None;
                            println!("ticker_core: recv Stop");
                        }

                        TickerControl::Reset => {
                            spend = Duration::from_secs(0);
                            println!("ticker_core: recv Reset");
                        }

                        TickerControl::Notification(n) => {
                            notification = Some(n);
                            println!("ticker_core: recv Notification {:?}", notification);
                        }
                    }
                }

                Err(err) if err == RecvTimeoutError::Timeout => {
                },

                Err(err) if err == RecvTimeoutError::Disconnected => {
                    println!("Failed to try_send current position");
                    break;
                }
                Err(_) => { panic!("Unknown error") }
            }

            if ! start_time.is_none() {
                spend = spend + start_time.unwrap().elapsed();

                if spend > duration.unwrap() {
                    start_time = None;

                    ticker_notice_tx.try_send(
                        TickerStateNotice::Stop)
                            .unwrap_or_else(|_| println!("Failed to try_send current position"));

                    // notification variable must initialized at initialization phase
                    assert!(!notification.is_none());
                    notify_user(notification.as_ref().unwrap(), &sound_control, &identifier);

                } else {
                    start_time = Some(Instant::now());
                }
            }

            ticker_notice_tx.try_send(
                TickerStateNotice::Position(spend.as_secs().try_into().unwrap()))
                    .unwrap_or_else(|_| println!("Failed to try_send current position"));

            print!("start_time {:?}", start_time);
            print!("duration {:?}", duration);
            print!("notification {:?}", notification);
            println!(" spend {:?}", spend);
        }
    });

    (ticker_control_tx, ticker_notice_rx)
}

fn notify_user(notification: &NotificationType, tx: &mpsc::SyncSender<SoundControl>, identifier: &String) {
    match notification {
        NotificationType::VoiceSound(n) => {
            tx.send(
                SoundControl::PlayVoiceSound(n.clone()))
                    .unwrap_or_else(|_| println!("Failed to try_send current position"));
        },
        NotificationType::Sound => {
            tx.send(
                SoundControl::PlaySound)
                    .unwrap_or_else(|_| println!("Failed to try_send current position"));
        },
        NotificationType::Toast => {
            tauri::api::notification::Notification::new(identifier)
                .title("タイマー通知")
                .body("終了")
                .show().unwrap();
        },
    }
}
