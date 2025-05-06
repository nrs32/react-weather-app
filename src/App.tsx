import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SxStyledButton from './components/button-style-examples/sx-button'
import MUIStyledButton from './components/button-style-examples/mui-styled-button'
import EmotionStyledButton from './components/button-style-examples/emotion-styled-button'
import EmotionButton from './components/button-style-examples/emotion-button'
import './App.scss';

function App() {

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
    </>
  )
}

export default App
