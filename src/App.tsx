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


function App() {
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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <SxStyledButton/>
      <MUIStyledButton/>
      <EmotionStyledButton>Emotion Styled Div</EmotionStyledButton>
      <EmotionButton/>

      <pre style={{
        textAlign: 'left',
        fontFamily: 'inherit',
        padding: '20px',
        overflowWrap: 'break-word',
      }}>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default App
