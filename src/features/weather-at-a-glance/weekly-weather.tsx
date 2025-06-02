import { Box, useTheme } from '@mui/material';
import { dayKeys, type DayKey } from '../../types/weather-types';
import AtAGlanceDay from './at-a-glance-day';
import { scrollbarStyles } from '../../utils/scrollbar-styles';
import { useContext } from 'react';
import { WeatherContext } from '../../App';

type WeeklyWeatherProps = {
	selectedDay: DayKey;
	dayClicked: (dayKey: DayKey) => void;
};

const WeeklyWeather = ({ selectedDay, dayClicked }: WeeklyWeatherProps) => {
	const weatherData = useContext(WeatherContext)!;
	const theme = useTheme();

	return (
		<Box
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
			{dayKeys.map((key) => (
				<AtAGlanceDay
					key={`at-a-glance-day-${key}`}
					{...weatherData[key]}
					isDay={weatherData.current.isDay}
					isSelected={selectedDay === key}
					dayClicked={() => dayClicked(key)}
				/>
			))}
		</Box>
	);
};

export default WeeklyWeather;