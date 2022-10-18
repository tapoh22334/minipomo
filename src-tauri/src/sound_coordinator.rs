
use rodio::source::{SineWave, Source};
use rodio::{OutputStream, OutputStreamHandle, Sink};
use std::sync::mpsc;
use std::time::Duration;

use crate::voice_store;

#[derive(Debug, Clone)]
pub enum VoiceIndex {
    Oftonp = 0,
    Kana = 1,
    Mana = 2,
    Tsukuyomichan = 3,
    Shikokumetan = 4,
    Zundamon = 5,
}

impl TryFrom<u32> for VoiceIndex {
    type Error = ();

    fn try_from(v: u32) -> Result<Self, Self::Error> {
        match v {
            x if x == VoiceIndex::Oftonp as u32 => Ok(VoiceIndex::Oftonp),
            x if x == VoiceIndex::Kana as u32 => Ok(VoiceIndex::Kana),
            x if x == VoiceIndex::Mana as u32 => Ok(VoiceIndex::Mana),
            x if x == VoiceIndex::Tsukuyomichan as u32 => Ok(VoiceIndex::Tsukuyomichan),
            x if x == VoiceIndex::Shikokumetan as u32 => Ok(VoiceIndex::Shikokumetan),
            x if x == VoiceIndex::Zundamon as u32 => Ok(VoiceIndex::Zundamon),
            _ => Err(()),
        }
    }
}

pub enum SoundControl {
    PlayVoiceSound(VoiceIndex),
    PlaySound,
    Volume(u32),
    Quit,
}

pub fn start() -> mpsc::SyncSender<SoundControl> {
    let (tx, rx) = mpsc::sync_channel::<SoundControl>(10);

    let voice_store = voice_store::VoiceStore::new();

    std::thread::spawn(move || {
        let (mut _os, mut osh)
            = rodio::OutputStream::try_default().expect("failed to open sound device");
        let mut sink: Sink = Sink::try_new(&osh).expect("failed to create new sink");

        loop {
            match rx.recv() {
                Ok(msg) => {
                    match msg {
                        SoundControl::PlayVoiceSound(n) => {
                            println!("sound_coordinator: recv Play voicesound");

                            play_popopo(&mut sink);
                            let source = rodio::Decoder::new(
                                std::io::Cursor::new(voice_store.get_data((n as u32).try_into().unwrap()).clone()))
                                    .expect("failed to decord wav");
                            sink.append(source);
                        },

                        SoundControl::PlaySound => {
                            println!("sound_coordinator: recv PlaySound");
                            play_popopo(&mut sink);
                        },

                        SoundControl::Volume(n) => {
                            println!("sound_coordinator: recv Volume {:?}", n);
                            sink.set_volume(n as f32 / 100f32);
                        },

                        SoundControl::Quit => {
                            println!("sound_coordinator: recv Quit");
                            break;
                        }
                    }
                },
                Err(err) => { panic!("sound_coordinator: {:?}", err) }
            }

        }

        sink.sleep_until_end();
        println!("sound_coordinator: thread exit");
    });

    return tx;
}

fn play_popopo(sink: &mut Sink) {
        sink.append(
            SineWave::new(440.0)
                .take_duration(Duration::from_secs_f32(0.05))
                .amplify(0.20));
        sink.append(
            SineWave::new(0.)
                .take_duration(Duration::from_secs_f32(0.05))
                .amplify(0.20));
        sink.append(
            SineWave::new(440.0)
                .take_duration(Duration::from_secs_f32(0.05))
                .amplify(0.20));
        sink.append(
            SineWave::new(0.)
                .take_duration(Duration::from_secs_f32(0.05))
                .amplify(0.20));
        sink.append(
            SineWave::new(440.0)
                .take_duration(Duration::from_secs_f32(0.05))
                .amplify(0.20));
        sink.append(
            SineWave::new(0.)
                .take_duration(Duration::from_secs_f32(0.05))
                .amplify(0.20));
        sink.append(
            SineWave::new(440.0)
                .take_duration(Duration::from_secs_f32(0.05))
                .amplify(0.20));
        sink.append(
            SineWave::new(0.)
                .take_duration(Duration::from_secs_f32(0.05))
                .amplify(0.20));
}
