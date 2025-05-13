import type { Theme } from "@mui/material";
import Button from "@mui/material/Button"

type ThemedButtonProps = {
    onClick: () => void,
    label: string,
};

const ThemedButton: React.FC<ThemedButtonProps> = ({ onClick, label }) => {
  const buttonSx = (theme: Theme) => ({
    backgroundColor: theme.palette.bg.main,
    color: theme.palette.common.white,
    border: `2px solid ${theme.palette.cardBg.main}`,
    padding: '6px 16px',
    position: 'relative',
    bottom: '9px',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.palette.cardBg.main,
    },
  });

  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={buttonSx}
    >
      {label}
    </Button>
  )
}

export default ThemedButton;