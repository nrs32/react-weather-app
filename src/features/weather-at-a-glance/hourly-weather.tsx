import { Typography, useTheme } from '@mui/material';
import type { HourlyWeather as HourlyWeatherData } from '../../types/weather-types';
import AtAGlanceHour from './at-a-glance-hour';
import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { scrollbarStyles } from '../../utils/scrollbar-styles';

type HourlyWeatherProps = {
  dayOfWeek: string;
  date: string;
  hourlyWeather: HourlyWeatherData[];
};

const HourlyWeather = ({ dayOfWeek, date, hourlyWeather }: HourlyWeatherProps) => {
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0; // Reset horizontal scroll on date change
    }
  }, [date]);

  return (
    <>
      <Typography sx={{ fontSize: '20px', fontWeight: 700, margin: '20px 0 15px 0' }}>Hourly Weather ({dayOfWeek} {date})</Typography>

      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          gap: 2, // spacing between days
          paddingBottom: '15px',

          ...scrollbarStyles(theme)
        }}
      >
        {hourlyWeather.map(hourly => (
          <AtAGlanceHour key={hourly.time} weatherCodeInfo={hourly.weatherCodeInfo} isDay={hourly.isDay} temperature={hourly.temperature} time={hourly.time}></AtAGlanceHour>
        ))}
      </Box>
    </>
  );
};

export default HourlyWeather;