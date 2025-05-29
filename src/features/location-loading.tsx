import { useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import PlaceIcon from '@mui/icons-material/Place';

const LocationLoadingMap = () => {
  const theme = useTheme();
  const placeRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      sx={{
        height: 'calc(100vh - 20px)',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <MapIcon
        sx={{
          fontSize: 150,
          color: theme.palette.blue.main,
          zIndex: 1,
          display: 'flex',
          transform: 'perspective(500px) rotateX(40deg)',
          transformOrigin: 'center',
        }}
      />

      <Box
        ref={placeRef}
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          zIndex: 2,
        }}
      >
        <PlaceIcon sx={{ fontSize: 45, color: '#d32f2f' }} />
      </Box>

      <Typography sx={{ fontSize: '20px', fontWeight: 700, color: theme.palette.text.primary, letterSpacing: theme.palette.text.secondaryLetterSpacing }}>
        LOCATING...
      </Typography>
    </Box>
  );
};

export default LocationLoadingMap;
