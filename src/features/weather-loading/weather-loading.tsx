import { Box, useTheme } from '@mui/material';
import WeatherGridSweep from './weather-grid-sweep';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type WeatherLoadingProps = {
};

const WeatherLoading = ({  }: WeatherLoadingProps) => {
  const theme = useTheme();

   const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
  if (!textRef.current) return;

    // Wait for fonts to load first
    document.fonts.ready.then(() => {
      if (!textRef.current) return;

      // Wrap each character (including spaces) in a span
      const wrappedText = [..."LOADING WEATHER DATA . . ."].map(char => {
        if (char === ' ') {
          // Use &nbsp; for visible space and fixed width to keep spacing consistent
          return `<span style="display:inline-block; width:0.5em;">&nbsp;</span>`;
        }
        // normal char span
        return `<span style="display:inline-block;">${char}</span>`;
      }).join('');

      textRef.current.innerHTML = wrappedText;

      const chars = textRef.current.querySelectorAll('span');

      const upDuration = 0.8;
      const downDuration = 0.8;
      const pauseDuration = 3.8;
      const staggerDelay = 0.13;

      const timelines: gsap.core.Timeline[] = [];

      chars.forEach((char, i) => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

        tl.to(char, {
          y: -40,
          duration: upDuration,
          ease: 'power1.inOut',
        })
        .to(char, {
          y: 0,
          duration: downDuration,
          ease: 'power1.inOut',
        })
        .to(char, {
          y: 0,
          duration: pauseDuration,
        });

        tl.delay(i * staggerDelay);

        timelines.push(tl);
      });

      // Cleanup on unmount
      return () => {
        timelines.forEach(tl => tl.kill());
      };
    });
  }, []);

  return (
    <>
      <WeatherGridSweep/>
      <Box 
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
          backgroundColor: `${theme.palette.bg.main}0D`, // semi-transparent dark
          backdropFilter: 'blur(10px)', // blur behind the element
          WebkitBackdropFilter: 'blur(10px)', // for Safari support
          width: '100%',
          height: '153px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
      </Box>
      <Box sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        padding: '5px 10px',
        background: theme.palette.bg.main,
      }}>Icons from <a href="https://basmilius.github.io/weather-icons/index-line.html" target='_blank'>Basmilius</a></Box>
    </>
  );
};

export default WeatherLoading;