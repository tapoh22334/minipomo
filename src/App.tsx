import * as React from 'react';
import './App.css';
import {CircularProgressWithLabel} from './modules/CircularProgressWithLabel'
import {Widget} from './modules/WidgetFrame'
import {CustomTitleBar} from './modules/CustomTitleBar'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import {AppContext} from './modules/AppContext';

function App() {
    const [view, setView] = React.useState('');

    document.addEventListener(
        "contextmenu",
        (event) => {
            console.log(event);
            event.preventDefault();
            },
        { capture: true }
    );

    const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
        console.log(event);
        console.log(nextView);
        setView(nextView);
    };

    const {min1, min2, min3, notificationType} = React.useContext(AppContext);
    const [min1State, setMin1State] = min1;
    const [min2State, setMin2State] = min2;
    const [min3State, setMin3State] = min3;
    const [notificationTypeState, setNotificationTypeState] = notificationType;

  return (
    <Widget data-tauri-drag-region className="App">

        <CustomTitleBar />

        <Box data-tauri-drag-region sx={{mt: 0}}>
            <CircularProgressWithLabel value={90} min={25} sec={0} />
        </Box>

        <Box data-tauri-drag-region>
        <ToggleButtonGroup
            orientation="vertical"
            value={view}
            exclusive
            onChange={handleChange}
            size="small"
            sx={{backgroundColor: '#fff'}}
        >
            <ToggleButton value="work" aria-label="work">
                <Typography variant="button">{min1State}分</Typography>
            </ToggleButton>
            <ToggleButton value="short-break"aria-label="short-break">
                <Typography variant="button">{min2State}分</Typography>
            </ToggleButton>
            <ToggleButton value="long-break"aria-label="long-break">
                <Typography variant="button">{min3State}分</Typography>
            </ToggleButton>
        </ToggleButtonGroup>
        </Box>

    </Widget>
  );
}

export default App;
