import { type Theme } from '@mui/material/styles';

export const scrollbarStyles = (theme: Theme) => ({
  '&::-webkit-scrollbar': {
    height: '28px', // (track + thumb height)
  },

  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent', // Hides background
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.lightGrey.main,
    borderRadius: '15px',

    border: '10px solid transparent', // hides thumb edges but increases clickable area
    backgroundClip: 'padding-box', // Ensures background color excludes the transparent border
  },
});
