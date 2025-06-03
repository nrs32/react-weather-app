import { useTheme } from '@mui/material/styles';
import { Box, LinearProgress, type LinearProgressProps } from '@mui/material';
import React, { useRef, useState } from 'react';
import useThrottle from '../hooks/throttled-hook';
import useAnimatedProgressScrollTrigger from '../hooks/animated-progress-scroll-trigger';

interface GradientLinearProgressProps extends LinearProgressProps {
  id: string; // unique ID per instance
  gradientstops: [string, string]; // [startColor, endColor]
}

const GradientLinearProgress: React.FC<GradientLinearProgressProps> = (props: GradientLinearProgressProps) => {
  const [startColor, endColor] = props.gradientstops;
  const { id } = props;
  const theme = useTheme();
  const gradientId = `linear-progress-${id}`;
  const progressId = `linear-gradient-${id}`;

  const [animatedValue, setAnimatedValue] = useState(0);
  const throttledSetAnimatedValue = useThrottle(setAnimatedValue, 60);
  const valueRef = useRef({ v: 0 });

  useAnimatedProgressScrollTrigger({
    elementId: progressId,
    value: props.value!,
    throttledSetAnimatedValue,
    setAnimatedValue,
    valueRef,
  });

  return (
    <Box position="relative" display="inline-flex" flexGrow={1}>
      {/* Create the gradient svg to use for the progress track */}
      <svg width={0} height={0}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
      </svg>

      <LinearProgress 
        {...props} 
        id={progressId}
        value={animatedValue}
        variant="determinate"
        sx={{
          width: '100%',
          height: '8px',
          borderRadius: '5px',
          background: theme.palette.text.secondary, // unused track
          '& .MuiLinearProgress-bar': {
            borderRadius: '5px',
            backgroundImage: `linear-gradient(to right, ${startColor}, ${endColor})`,
          },
        }} />
    </Box>
  );
}
export default GradientLinearProgress;
