import { Box, } from '@mui/material';
import { dayKeys, type WeatherData } from '../types/weather-types';
import AtAGlanceDay from './at-a-glance-day';

type WeeklyWeatherProps = {
    weatherData: WeatherData;
};

const WeeklyWeather = ({ weatherData }: WeeklyWeatherProps) => {
  return (
    <Box
        sx={{
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        gap: 2, // spacing between days
        paddingBottom: '15px',

        '&::-webkit-scrollbar': {
            height: '8px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent', // Hides background
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#6c6f7e',
            borderRadius: '4px',
        },
        }}
    >
        {dayKeys.map((key) => (
            <AtAGlanceDay
                key={`at-a-glance-day-${key}`}
                {...weatherData[key]}
                isDay={weatherData.current.isDay}
            />
        ))}
    </Box>
  );
};

export default WeeklyWeather;