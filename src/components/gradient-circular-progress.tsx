import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, type CircularProgressProps } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import userThrottle from '../utils/hooks/throttled-hook';

interface GradientCircularProgressProps extends CircularProgressProps {
  id: string; // unique ID per instance
  gradientstops: [string, string]; // [startColor, endColor]
  labelcolor?: string;
  label?: string;
  labelsize?: number; // font-size
  subtitle: string;
}

const GradientCircularProgress: React.FC<GradientCircularProgressProps> = (props: GradientCircularProgressProps) => {
  const [startColor, endColor] = props.gradientstops;
  const { id, label, labelcolor, labelsize, subtitle } = props;
  const theme = useTheme();
  const gradientId = `circle-progress-${id}`;

  const [animatedValue, setAnimatedValue] = useState(0);
  const throttledSetAnimatedValue = userThrottle(setAnimatedValue, 60);
  const valueRef = useRef({ v: 0 });

  useEffect(() => {
    const tween = gsap.to(valueRef.current, {
      duration: props.value! / 75, // so every progress appears at each % at the same time. 100% takes 1.3 sec, 33 takes .44 sec etc.
      v: props.value,
      ease: 'none',
      onUpdate: () => {
        throttledSetAnimatedValue(Math.round(valueRef.current.v));
      },
      paused: true, // So we don't run until we are scroll-triggered
    });

		const startTrigger = ScrollTrigger.create({
			trigger: `#circular-gradient-${label}-box`,
			start: 'bottom bottom',
			end: 'bottom bottom',
			onEnter: () => {
        tween.restart(true);
			},
			onEnterBack: () => { },
			onLeave: () => { },
			onLeaveBack: () => { },
		});

		const endTrigger = ScrollTrigger.create({
			trigger: `#circular-gradient-${label}-box`,
			start: 'top bottom',
			end: 'top bottom',
			onEnter: () => { },
			onEnterBack: () => { },
			onLeave: () => { },
			onLeaveBack: () => {
				tween.pause(0);
        setAnimatedValue(0);
			},
		});

		return () => {
			// if this component unmounts or id changes
			// cleanup gsap animation and scrollTriggers for this graph 
			startTrigger.kill();
			endTrigger.kill();
			tween.kill();
		};

	}, [props.value]);

  return (
    <Box position="relative" display="inline-flex">

      {/* Create the gradient svg to use for the progress track */}
      <svg width={0} height={0}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
      </svg>

      {/* The unused track is grey */}
      <CircularProgress
        variant="determinate"
        {...props}
        value={100}
        sx={{
          color: theme.palette.text.secondary,
        }}
      />

      {/* The filled track */}
      <CircularProgress
        {...props}
        id={`circular-gradient-${label}-box`}
        value={animatedValue}
        variant="determinate"
        sx={{
          position: 'absolute',
          left: 0,
          'svg circle': {
            stroke: `url(#${gradientId})`,
            strokeLinecap: 'round', // Make progress thing be round
          },
        }}
      />

      {/* Label logic */}
      {label && <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: labelcolor,
          fontWeight: 700,
          fontSize: `${labelsize}px`,
          textAlign: 'center',
          lineHeight: 1,
        }}>
          { label }
          <Box
            sx={{
              color: theme.palette.text.primary,
              fontSize: '14px',
              letterSpacing: theme.palette.text.secondaryLetterSpacing,
              textTransform: 'uppercase',
            }}>
            { subtitle }
          </Box>
        </Box>}
    </Box>
  );
}
export default GradientCircularProgress;
