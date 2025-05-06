/** @jsxImportSource @emotion/react */
import { styled } from '@mui/material/styles';

const EmotionStyledButton = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.teal.main,
  color: theme.palette.common.white,
  padding: '10px 20px',
  '&:hover': {
    backgroundColor: theme.palette.blue.main,
  },
}));

export default EmotionStyledButton;
