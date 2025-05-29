import { useEffect, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import PlaceIcon from '@mui/icons-material/Place';
import gsap from 'gsap';

const LocationLoadingMap = () => {
  const theme = useTheme();
  const placeRef = useRef<HTMLDivElement>(null);
  const bottomLeft = { x: -55, y: -30 };

  useEffect(() => {
    if (!placeRef.current) return;

    gsap.set(placeRef.current, bottomLeft);

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });

    const bounceLanding = (x: number, y: number) => {
      // Glide in slightly above the target position
      tl.to(placeRef.current, {
        x,
        y: y - 15,
        duration: 0.5,
        ease: "power2.inOut",
      });

      // bounces
      tl.to(placeRef.current, { y,        duration: 0.2, ease: "sine.in" });
      tl.to(placeRef.current, { y: y - 8, duration: 0.2, ease: "sine.out" });
      tl.to(placeRef.current, { y,        duration: 0.2, ease: "sine.in" });
      tl.to(placeRef.current, { y: y - 4, duration: 0.15, ease: "sine.out" });
    };

    bounceLanding(30, -25);   // bottom right
    bounceLanding(-60, -60);  // top left
    bounceLanding(-10, -50);  // top right
    bounceLanding(bottomLeft.x, bottomLeft.y);  // bottom left
  }, []);

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
