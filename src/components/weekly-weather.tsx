import { Box, useTheme } from '@mui/material';
import { dayKeys, type DayKey, type WeatherData } from '../types/weather-types';
import AtAGlanceDay from './at-a-glance-day';

type WeeklyWeatherProps = {
	weatherData: WeatherData;
	selectedDay: DayKey;
	dayClicked: (dayKey: DayKey) => void;
};

const WeeklyWeather = ({ weatherData, selectedDay, dayClicked }: WeeklyWeatherProps) => {
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

				'&::-webkit-scrollbar': {
					height: '8px',
				},
				'&::-webkit-scrollbar-track': {
					backgroundColor: 'transparent', // Hides background
				},
				'&::-webkit-scrollbar-thumb': {
					backgroundColor: theme.palette.lightGrey.main,
					borderRadius: '4px',
				},
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