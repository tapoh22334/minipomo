import React from 'react';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Slider, {
    SliderProps,
} from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import IconButton from '@mui/material/IconButton';

import { invoke } from '@tauri-apps/api'
import { emit } from '@tauri-apps/api/event'
import { appWindow, PhysicalPosition } from '@tauri-apps/api/window';

import {AppContext} from './modules/AppContext';

const AppSetting = (
) => {

    // Ignore right click on setting view
    document.addEventListener(
        "contextmenu",
        (event) => {
            console.log(event);
            event.preventDefault();
            },
        { capture: true }
    );

    const {windowPosition, min1, min2, min3, notificationType, voice} = React.useContext(AppContext);
    const [winPositionState, setWinPositionState] = windowPosition;
    const [min1State, setMin1State] = min1;
    const [min2State, setMin2State] = min2;
    const [min3State, setMin3State] = min3;
    const [notificationTypeState, setNotificationTypeState] = notificationType;
    const [voiceState, setVoiceState] = voice;

    const onMin1Change = (event: Event, value: number | number[]) => {
        console.log(value);
        setMin1State(value as number);
        emit('min1State', value as number);
        localStorage.setItem("minipomo-Min1", JSON.stringify(value));
    };

    const onMin2Change = (event: Event, value: number | number[]) => {
        console.log(value);
        setMin2State(value as number);
        emit('min2State', value as number);
        localStorage.setItem("minipomo-Min2", JSON.stringify(value));
    };

    const onMin3Change = (event: Event, value: number | number[]) => {
        console.log(value);
        setMin3State(value as number);
        emit('min3State', value as number);
        localStorage.setItem("minipomo-Min3", JSON.stringify(value));
    };

    const onNotificationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;
        console.log(value);

        setNotificationTypeState(value);
        invoke("cmd_set_notification", {notification: value, index: voiceState});
        localStorage.setItem("minipomo-NotificationType", JSON.stringify(value));
    };

    const onVoiceChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string
        console.log(value);

        setVoiceState(value);
        invoke("cmd_set_notification", {notification: notificationTypeState, index: value});
        localStorage.setItem("minipomo-Voice", JSON.stringify(value));
    };

    const onPlayClick = () => {
        invoke("cmd_play_voice", {notification: notificationTypeState, index: voiceState});
    };

    return (
        <Box margin={3} sx={{ justifyContent: 'center' }}>
            <Box sx={{ width: 320 }}>
                <Typography gutterBottom>Forcus</Typography>
                <Slider
                    aria-label="forcus"
                    size="small"
                    value={min1State}
                    onChange={onMin1Change}
                    valueLabelDisplay="auto"
                    min={1}
                    max={90} />

                <Typography gutterBottom>Short Break</Typography>
                <Slider
                    aria-label="shortbreak"
                    size="small"
                    value={min2State}
                    onChange={onMin2Change}
                    valueLabelDisplay="auto"
                    min={1}
                    max={90} />

                <Typography gutterBottom>Long Break</Typography>
                <Slider
                    aria-label="longbreak"
                    size="small"
                    value={min3State}
                    onChange={onMin3Change}
                    valueLabelDisplay="auto"
                    min={1}
                    max={90}
                    />
            </Box>

            <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">通知方法</FormLabel>
            <RadioGroup
              row
              aria-labelledby="how-to-notify-group-label"
              name="how-to-notify-buttons-group"
              value={notificationTypeState}
              onChange={onNotificationTypeChange}
            >
              <FormControlLabel value="voice" control={<Radio />} label="音+声" />
              <FormControlLabel value="sound" control={<Radio />} label="音" />
              {/*<FormControlLabel value="toast" control={<Radio />} label="トースト" />*/}
            </RadioGroup>
            </FormControl>

            <Stack direction="row" spacing={2}>
                <FormControl size="small" disabled={notificationTypeState !== "voice"}>
                  <Select
                    labelId="voicelabel"
                    id="voice-select"
                    value={voiceState}
                    onChange={onVoiceChange}
                  >
                    <MenuItem value={0}>COEIROINK:おふとんP</MenuItem>
                    <MenuItem value={1}>COEIROINK:KANA</MenuItem>
                    <MenuItem value={2}>COEIROINK:MANA</MenuItem>
                    <MenuItem value={3}>COEIROINK:つくよみちゃん</MenuItem>
                    <MenuItem value={4}>VOICEVOX:四国めたん</MenuItem>
                    <MenuItem value={5}>VOICEVOX:ずんだもん</MenuItem>
                  </Select>
                </FormControl>
                <IconButton onClick={onPlayClick} sx={{ border: 1 }} aria-label="play">
                    <PlayArrowRounded />
                </IconButton>
            </Stack>
        </Box>
    );
};

export default AppSetting;
