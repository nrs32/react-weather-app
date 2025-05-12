import { Box, useTheme } from '@mui/material';

type CurrentTempDisplayProps = {
    actualTemp: number;
    feelsLike: number;
};

const CurrentTempDisplay = ({ actualTemp, feelsLike }: CurrentTempDisplayProps) => {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ fontSize: '70px' }}>{actualTemp}°
          <Box sx={{ display: 'inline', fontSize: '35px', verticalAlign: 'text-top' }}>F</Box>
      </Box>
      <Box sx={{ fontSize: '23px', letterSpacing: theme.palette.text.secondaryLetterSpacing}}>
          FEELS LIKE {feelsLike}°<Box sx={{ display: 'inline', fontSize: '15px', verticalAlign: 'text-top' }}>F</Box>
      </Box>
    </>
  );
};

export default CurrentTempDisplay;
