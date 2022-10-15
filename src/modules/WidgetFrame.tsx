import { styled } from '@mui/material/styles';

export const Widget = styled('div')(({ theme }) => ({
        padding: 4,
        paddingTop: 2,
        borderRadius: 8,
        width: 64,
        maxWidth: '100%',
        margin: 0,
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(230,230,230,0.8)',
        backdropFilter: 'blur(40px)',
  }));

