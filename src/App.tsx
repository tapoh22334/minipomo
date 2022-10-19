import * as React from 'react';
import './App.css';
import {CircularProgressWithLabel} from './modules/CircularProgressWithLabel'
import {Widget} from './modules/WidgetFrame'
import {CustomTitleBar} from './modules/CustomTitleBar'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { invoke } from "@tauri-apps/api";
import { listen } from '@tauri-apps/api/event'
import { appWindow, PhysicalPosition, currentMonitor} from '@tauri-apps/api/window';

import {AppContext} from './modules/AppContext';

function App() {
    const [secState, setSecState] = React.useState(0);
    const [startState, setStartState] = React.useState('');

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

    React.useEffect(() => {
            const _unlisten = appWindow.onMoved(({ payload: position }) => {
                console.log('Window moved', position);
                if (position.x > -30000) {
                    localStorage.setItem("minipomo-WindowPosition", JSON.stringify(position));
                } else {
                    console.log('Window is minimized');
                }
            });

            appWindow.setPosition(new PhysicalPosition(winPositionState.x, winPositionState.y));
    }, []);

    React.useEffect(() => {
        const unlisten = listen('currentTime', (event) => {
            console.log(event.payload as number);
            setSecState(event.payload as number);
        });
    }, []);

    React.useEffect(() => {
        const unlisten = listen('startState', (event) => {
            console.log(event.payload as string);
            setStartState(event.payload as string);
        });
    }, []);

    React.useEffect(() => {
        const unlisten = listen('min1State', (event) => {
            console.log(event.payload);
            setMin1State(event.payload as number);

            invoke("cmd_set_stop", {});
            invoke("cmd_set_reset", {});
            setStartState('');
        });
    }, []);

    React.useEffect(() => {
        const unlisten = listen('min2State', (event) => {
            console.log(event.payload);
            setMin2State(event.payload as number);

            invoke("cmd_set_stop", {});
            invoke("cmd_set_reset", {});
            setStartState('');
        });
    }, []);

    React.useEffect(() => {
        const unlisten = listen('min3State', (event) => {
            console.log(event.payload);
            setMin3State(event.payload as number);

            invoke("cmd_set_stop", {});
            invoke("cmd_set_reset", {});
            setStartState('');
        });
    }, []);

    React.useEffect(() => {
        invoke("cmd_set_notification", {notification: notificationTypeState, index: voiceState});
    }, []);

    const handleStartChange = (event: React.MouseEvent<HTMLElement>, nextStartState: string) => {
        console.log(nextStartState === null ? 'stop' : nextStartState as string);

        if (nextStartState === null) {
            invoke("cmd_set_stop", {});
            invoke("cmd_set_reset", {});
        }
        else if (nextStartState === 'focus') {
            invoke("cmd_set_play", {secs: min1State * 60});
        }
        else if (nextStartState === 'short-break') {
            invoke("cmd_set_play", {secs: min2State * 60});
        }
        else if (nextStartState === 'long-break') {
            invoke("cmd_set_play", {secs: min3State * 60});
        }

        setStartState(nextStartState);
    };

    const toProgressPercentage = (secst: number, startst: string) => {
        if (startst === 'stop') {
            return 0;
        }
        if (startst === 'focus') {
            return secst * 100.0 / (min1State * 60);
        }
        else if (startst === 'short-break') {
            return secst * 100.0 / (min2State * 60);
        }
        else if (startst === 'long-break') {
            return secst * 100.0 / (min3State * 60);
        }

        return 0;
    }

  return (
    <Widget data-tauri-drag-region className="App">

        <CustomTitleBar />

        <Box data-tauri-drag-region sx={{mt: 0}}>
            <CircularProgressWithLabel
                value={toProgressPercentage(secState, startState)}
                //value={65}
                sec={secState} />
        </Box>

        <Box data-tauri-drag-region>
        <ToggleButtonGroup
            orientation="vertical"
            value={startState}
            color="primary"
            exclusive
            onChange={handleStartChange}
            size="small"
            sx={{backgroundColor: '#fff'}}
        >
            <ToggleButton value="focus" aria-label="focus">
                <Typography variant="button"><b>{min1State}</b>分</Typography>
            </ToggleButton>
            <ToggleButton value="short-break"aria-label="short-break">
                <Typography variant="button"><b>{min2State}</b>分</Typography>
            </ToggleButton>
            <ToggleButton value="long-break"aria-label="long-break">
                <Typography variant="button"><b>{min3State}</b>分</Typography>
            </ToggleButton>
        </ToggleButtonGroup>
        </Box>

    </Widget>
  );
}

export default App;
