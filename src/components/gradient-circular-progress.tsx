import { CircularProgress, type CircularProgressProps } from '@mui/material';
import React from 'react';

interface GradientCircularProgressProps extends CircularProgressProps {
  id: string; // unique ID per instance
  gradientstops: [string, string]; // [startColor, endColor]
}

const GradientCircularProgress: React.FC<GradientCircularProgressProps> = (props: GradientCircularProgressProps) => {
  const [startColor, endColor] = props.gradientstops;

  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        {...props}
        variant="determinate"
        sx={{
          'svg circle': { stroke: 'url(#my_gradient)' },
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round', // Make progress thing be round
          },
        }}
      />
    </React.Fragment>
  );
}
export default GradientCircularProgress;
