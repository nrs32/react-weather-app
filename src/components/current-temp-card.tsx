import { Box, useTheme } from '@mui/material';
import WeatherCard from './weather-card';

type CurrentTempCardProps = {
  actualTemp: number;
  feelsLike: number;
};

const CurrentTempCard = ({ actualTemp, feelsLike }: CurrentTempCardProps) => {
  const theme = useTheme();

  return (
    <WeatherCard sx={{ fontWeight: 700, textAlign: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
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
    </WeatherCard>
  );
};

export default CurrentTempCard;
