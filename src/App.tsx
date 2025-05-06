import { useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SxStyledButton from './components/button-style-examples/sx-button'
import MUIStyledButton from './components/button-style-examples/mui-styled-button'
import EmotionStyledButton from './components/button-style-examples/emotion-styled-button'
import EmotionButton from './components/button-style-examples/emotion-button'
import './App.scss';
import { getWeather } from './services/weather-service'
import WeatherCard from './components/weather-card'
import GradientCircularProgress from './components/gradient-circular-progress'

import { useTheme } from '@mui/material/styles';

function App() {
  const theme = useTheme();

  // TODO: considar ipinfo.io to get user lat and long
  // Then do the thing from the video where we wait for that query before doing the one that gets the weather
  const lat: number = 42.96;
  const long: number = -85.67;
  const { isPending, isError, data, error } = useQuery({
    // queryKey is a unique key to cache results from this call
    // e.g. controller name, route, and any params you pass the call
    queryKey: ['weather', lat, long],
    queryFn: () => getWeather(lat, long)
  });

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <>
     <h1 className='heading'> Weather Dashboard </h1>

     {/*
      Demo of Buttons I made
      <SxStyledButton/>
      <MUIStyledButton/>
      <EmotionStyledButton>Emotion Styled Div</EmotionStyledButton>
      <EmotionButton/>
    */}

      <WeatherCard>
      <GradientCircularProgress
        id="humidity"
        value={70}
        thickness={4}
        size={100}
        gradientstops={[theme.palette.pink.main, theme.palette.teal.main]}
      />
      </WeatherCard>

      <WeatherCard>
        Raw Data:
        <pre className='raw-data'>{JSON.stringify(data, null, 2)}</pre>
      </WeatherCard>

      <div className='tech-icons'>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} alt="React logo" />
        </a>
      </div>
    </>
  )
}

export default App
