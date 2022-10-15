import * as React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function CircularProgressWithLabel(
  props: CircularProgressProps & { min: number, sec: number },
) {

  const toTimeString = (min: number, sec: number) => {
      return (
              min.toString()
              + ':'
              + ("00" + sec.toString()).slice(-2)
             );
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
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
          sx={{
            bgcolor: 'rgba(255,255,255,0.6)',
            borderRadius: 4,
          }}
        >{toTimeString(props.min, props.sec)}</Typography>
      </Box>
    </Box>
  );
}
