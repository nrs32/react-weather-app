import React from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type CarouselControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
  hasPrev: boolean;
  hasNext: boolean;
  children: React.ReactNode; // like ng-content in angular
};

const CarouselControls = ({ onPrev, onNext, hasPrev, hasNext, prevLabel, nextLabel, children }: CarouselControlsProps) => {
  const theme = useTheme();

  const iconStyles = {
    color: theme.palette.text.primary,
    fontSize: '45px',
  };

  const buttonLabelStyles = {
    fontSize: '14px',
    fontWeight: '700',
    marginTop: '49px',
    position: 'absolute',
  }

  return (
    <Box display="flex" alignItems="center">
      <Box display="flex" flexDirection="column" alignItems="center">
        <IconButton onClick={onPrev} disabled={!hasPrev}>
          <ChevronLeftIcon sx={{...iconStyles, opacity: !hasPrev ? .5 : 1}}/>
        </IconButton>
        <Box sx={{...buttonLabelStyles, opacity: !hasPrev ? .5 : 1}}>
          {prevLabel}
        </Box>
      </Box>

      <Box flexGrow={1}>
        {children}
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center">
        <IconButton onClick={onNext} disabled={!hasNext}>
          <ChevronRightIcon sx={{...iconStyles, opacity: !hasNext ? .5 : 1}}/>
        </IconButton>
        <Box sx={{...buttonLabelStyles, opacity: !hasNext ? .5 : 1}}>
          {nextLabel}
        </Box>
      </Box>
    </Box>
  );
};

export default CarouselControls;
