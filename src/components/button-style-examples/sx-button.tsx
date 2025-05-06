import { Button } from '@mui/material';

function SxStyledButton() {
  return (
    <Button
      sx={(theme) => ({
        backgroundColor: theme.palette.purple.main,
        color: theme.palette.common.white,
        padding: '10px 20px',
        '&:hover': {
          backgroundColor: theme.palette.pink.main,
        },
      })}
    >
      SX Button
    </Button>
  );
}

export default SxStyledButton;