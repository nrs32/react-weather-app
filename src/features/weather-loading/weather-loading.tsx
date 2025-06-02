import { Box, Typography, useTheme, type Theme } from '@mui/material';
import WeatherGridSweep from './weather-grid-sweep';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const WeatherLoading = () => {
  const theme = useTheme();

  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
  if (!textRef.current) return;

    // Wait for fonts to load
    document.fonts.ready.then(() => {
      if (!textRef.current) return;

      textRef.current.innerHTML = splitChars('LOADING WEATHER DATA . . .');
      const chars = textRef.current.querySelectorAll('span');

      const upDuration = 0.8;
      const downDuration = 0.8;
      const pauseDuration = 3.8;
      const staggerDelay = 0.13;

      const timelines: gsap.core.Timeline[] = [];

      chars.forEach((char, i) => {
        // repeat infinitely, pausing after each timeline completion
        const tl = gsap.timeline({ repeat: -1, repeatDelay: pauseDuration }); 

        tl.to(char, {
          y: -40,
          duration: upDuration,
          ease: 'power1.inOut',
        })
        .to(char, {
          y: 0,
          duration: downDuration,
          ease: 'power1.inOut',
        });

        // stagger each timeline so characters bounce consecutively
        tl.delay(i * staggerDelay);

        timelines.push(tl);
      });

      return () => {
        // kill timelines on unmount
        timelines.forEach(tl => tl.kill());
      };
    });
  }, []);

  return (
    <>
      <WeatherGridSweep/>

      <Typography
        ref={textRef}
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          fontWeight: 700,
          fontSize: '27px',
          borderRadius: '10px',
          width: '100%',
          height: '153px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          // frosted glass blur effect 
          backgroundColor: `${theme.palette.bg.main}0D`,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)', // (safari)
        }}>
      </Typography>

      <IconCreditDiv theme={theme}></IconCreditDiv>
    </>
  );
};

const splitChars = (text: string) => {
  // Wrap each character (including spaces) in a span
  // Could not get this working with char split in gsap SplitText with preserveSpaces
  return [...text].map(char => {
    if (char === ' ') {
      // Use &nbsp; and width for spaces
      return `<span style="display:inline-block; width:0.5em;">&nbsp;</span>`;
    }

    return `<span style="display:inline-block;">${char}</span>`;
  }).join('');
}

const IconCreditDiv = ({theme}: { theme: Theme}) => {
  return (
    <Box sx={{ 
      position: 'fixed',
      bottom: 0,
      left: 0,
      padding: '5px 10px',
      background: theme.palette.bg.main,
    }}>
      Icons from <a href="https://basmilius.github.io/weather-icons/index-line.html" target='_blank' style={{ color: 'white' }}>Basmilius</a>
    </Box>
  );
}

export default WeatherLoading;