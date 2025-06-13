import { type DayIndex } from '../types/weather-types';
import TempVHumidityGraph from './graphs/temp-v-humidity-graph';
import CarouselControls from '../components/carousel-controls';
import WeatherCard from '../components/weather-card';
import { useContext, useState } from 'react';
import { WeatherContext } from '../App';

const TempVHumidityCarousel = () => {
	const weatherData = useContext(WeatherContext)!;

	const { dayIndex, hasPrev, hasNext, onNext, onPrev } = useTempVHumidDayIndex();

	return (
		<WeatherCard width='738px' height='305px' sx={{ paddingLeft: '0', paddingRight: '5px'}}>
			<CarouselControls
				onPrev={onPrev}
				onNext={onNext}
				prevLabel={hasPrev ? weatherData[`day${(dayIndex - 1) as DayIndex}`].dayOfWeek : undefined}
				nextLabel={hasNext ? weatherData[`day${(dayIndex + 1) as DayIndex}`].dayOfWeek : undefined}
				hasPrev={hasPrev}
				hasNext={hasNext}
			>
				<TempVHumidityGraph title={`Humidity and Temperature (${weatherData[`day${dayIndex}`].dayOfWeek} ${weatherData[`day${dayIndex}`].date})`} hourlyWeather={weatherData[`day${dayIndex}`].hourlyWeather}></TempVHumidityGraph>
			</CarouselControls>
		</WeatherCard>
	);
};

function useTempVHumidDayIndex() {
  const [dayIndex, setDayIndex] = useState<DayIndex>(1);

  const hasPrev = dayIndex > 1;
  const hasNext = dayIndex < 7;

  const onNext = () => {
    if (hasNext) setDayIndex(prev => (prev + 1) as DayIndex);
  };

  const onPrev = () => {
    if (hasPrev) setDayIndex(prev => (prev - 1) as DayIndex);
  };

  return { dayIndex, hasPrev, hasNext, onNext, onPrev };
}

export default TempVHumidityCarousel;