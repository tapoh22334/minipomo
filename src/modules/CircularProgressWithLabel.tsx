import * as React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function CircularProgressWithLabel(
  props: CircularProgressProps & { sec: number },
) {

  const formatDuration = (sec: number) => {
      const minute = Math.floor(sec / 60);
      const secondLeft = sec - minute * 60;
      return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  return (
    <Box sx={{
        position: 'relative',
        bgcolor: 'rgba(255,255,255,0.6)',
        borderRadius: 6,
        display: 'inline-flex'
        }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="body2"
          component="div"
        >{formatDuration(props.sec)}</Typography>
      </Box>
    </Box>
  );
}
