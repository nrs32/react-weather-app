import { Box, useTheme } from '@mui/material';

type CurrentTempDisplayProps = {
    actualTemp: number;
    feelsLike: number;
};

const CurrentTempDisplay = ({ actualTemp, feelsLike }: CurrentTempDisplayProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: `linear-gradient(45deg, ${theme.palette.teal.main}, ${theme.palette.purple.main})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        paddingTop: '28px',
      }}>
        <Box sx={{ fontSize: '70px', display: 'inline-block', lineHeight: .75 }}>
          {actualTemp}°
          <Box sx={{ display: 'inline', fontSize: '35px', verticalAlign: 'top' }}>F</Box>
        </Box>
      </Box>

      <Box sx={{ width: '50%', margin: '27px auto 20px', borderBottom: '2px solid white' }}></Box>

      <Box sx={{ fontSize: '20px', letterSpacing: theme.palette.text.secondaryLetterSpacing }}>
          FEELS LIKE {feelsLike}°<Box sx={{ display: 'inline', fontSize: '15px', verticalAlign: 'text-top' }}>F</Box>
      </Box>
    </Box>
  );
};

export default CurrentTempDisplay;
