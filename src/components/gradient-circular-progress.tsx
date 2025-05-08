import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, type CircularProgressProps } from '@mui/material';
import React from 'react';

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
          color: '#3A3D4B',
        }}
      />

      {/* The filled track */}
      <CircularProgress
        {...props}
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
