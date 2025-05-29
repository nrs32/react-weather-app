import { type DayIndex, type WeatherData } from '../types/weather-types';
import TempVHumidityGraph from './graphs/temp-v-humidity-graph';
import CarouselControls from './carousel-controls';
import WeatherCard from './weather-card';
import { useState } from 'react';

type TempVHumidityCarouselProps = {
	weatherData: WeatherData;
};

const TempVHumidityCarousel = ({ weatherData }: TempVHumidityCarouselProps) => {
	const { dayIndex, hasPrev, hasNext, onNext, onPrev } = useTempVHumidDayIndex();

	return (
		<WeatherCard width='738px' height='340px' sx={{ paddingLeft: '0', paddingRight: '5px'}}>
			<CarouselControls
				onPrev={onPrev}
				onNext={onNext}
				prevLabel={hasPrev ? weatherData[`day${(dayIndex - 1) as DayIndex}`].dayOfWeek : undefined}
				nextLabel={hasNext ? weatherData[`day${(dayIndex + 1) as DayIndex}`].dayOfWeek : undefined}
				hasPrev={hasPrev}
				hasNext={hasNext}
			>
				<TempVHumidityGraph title={`Humidity and Temperature (${weatherData[`day${dayIndex}`].dayOfWeek} ${weatherData[`day${dayIndex}`].date})`} hourlyWeather={weatherData[`day${dayIndex}`].hourlyWeather} graphWidth={400} graphHeight={200} chartTop={7} chartLeft={0}></TempVHumidityGraph>
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