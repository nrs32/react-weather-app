import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.blue.main,
  color: '#fff',
  padding: '10px 20px',
  '&:hover': {
    backgroundColor: theme.palette.teal.main,
  },
}));

function MUIStyledButton() {
  return <CustomButton>MUI Styled Button</CustomButton>;
}

export default MUIStyledButton;