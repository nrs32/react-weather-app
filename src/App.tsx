import './App.scss';
import WeatherCard from './components/weather-card'
import Box from '@mui/material/Box';
import WeeklyTempSpreadGraph from './features/graphs/weekly-temp-spread-graph';
import WeatherCodeCard from './features/weather-code-card';
import CurrentTempCard from './features/current-temp-card';
import ThemedButton from './components/themed-button';
import TwilightCard from './features/twilight-card/twilight-card';
import FooterAttribution from './features/footer-attribution';
import TempVHumidityCarousel from './features/temp-v-humidity-carousel';
import WeatherAtAGlance from './features/weather-at-a-glance/weather-at-a-glance';
import WeatherDials from './features/weather-dials';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useAppLoading } from './utils/hooks/user-app-loading';

gsap.registerPlugin(ScrollTrigger);

// TODO: refactoring and cleanup for loading animation pages

function App() {
 
  const {
    isLoading,
    loadingScreen,
    error,
    data,
    refreshLocation,
    refetchWeatherData,
  } = useAppLoading();

  if (isLoading) return loadingScreen;
  if (error) return <span>Error: {error}</span>;
  
  const weatherData = data!;

  return (
    <>
      <h1 className='heading'> Weather Dashboard </h1>
      
      <Box sx={{ position: 'absolute', right: '15px', top: '22px', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <ThemedButton onClick={refreshLocation!} label='Refresh Location'/>
      <ThemedButton onClick={refetchWeatherData!} label='Refresh Weather (Auto is 5 Min)'/>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: "100px" }}>
        <CurrentTempCard actualTemp={weatherData.current.temperature} feelsLike={weatherData.current.apparentTemperature}></CurrentTempCard>
        <WeatherCodeCard isDay={weatherData.current.isDay} weatherCodeInfo={weatherData.current.weatherCodeInfo}></WeatherCodeCard>
        
        <WeatherDials 
          humidity={weatherData.current.humidity} 
          precipitation={weatherData.current.precipitation} 
          cloudCover={weatherData.current.cloudCover}/>

        <TwilightCard 
          timeToSunrise={weatherData.current.timeToSunrise} 
          timeToSunset={weatherData.current.timeToSunset}
          sunrise={weatherData.day1.sunrise}
          sunset={weatherData.day1.sunset}/>

        <WeatherAtAGlance weatherData={weatherData}/>

        <TempVHumidityCarousel weatherData={weatherData}/>

        <WeatherCard width='580px' height='340px'>
          <WeeklyTempSpreadGraph title={"Temperature Trend This Week"} weatherData={weatherData} graphWidth={400} graphHeight={200} chartTop={7} chartLeft={0}></WeeklyTempSpreadGraph>
        </WeatherCard>
      </Box>

      <FooterAttribution weatherData={weatherData}/>
    </>
  )
}

export default App
