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

    const {min1, min2, min3, notificationType} = React.useContext(AppContext);
    const [min1State, setMin1State] = min1;
    const [min2State, setMin2State] = min2;
    const [min3State, setMin3State] = min3;
    const [notificationTypeState, setNotificationTypeState] = notificationType;

    const onMin1Change = (event: Event, value: number | number[]) => {
        console.log(value);
        setMin1State(value as number);
        localStorage.setItem("minipomo-Min1", JSON.stringify(value));
    };

    const onMin2Change = (event: Event, value: number | number[]) => {
        console.log(value);
        setMin2State(value as number);
        localStorage.setItem("minipomo-Min2", JSON.stringify(value));
    };

    const onMin3Change = (event: Event, value: number | number[]) => {
        console.log(value);
        setMin3State(value as number);
        localStorage.setItem("minipomo-Min3", JSON.stringify(value));
    };

    const onNotificationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;
        console.log(value);
        setNotificationTypeState(value);
        localStorage.setItem("minipomo-NotificationType", JSON.stringify(value));
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
                    max={60} />

                <Typography gutterBottom>Short Break</Typography>
                <Slider
                    aria-label="shortbreak"
                    size="small"
                    value={min2State}
                    onChange={onMin2Change}
                    valueLabelDisplay="auto"
                    max={60} />

                <Typography gutterBottom>Long Break</Typography>
                <Slider
                    aria-label="longbreak"
                    size="small"
                    value={min3State}
                    onChange={onMin3Change}
                    valueLabelDisplay="auto"
                    max={60}
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
              <FormControlLabel value="toast" control={<Radio />} label="トースト" />
            </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default AppSetting;
