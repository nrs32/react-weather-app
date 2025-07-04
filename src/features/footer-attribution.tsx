import { Box } from '@mui/material';
import RawDataModal from '../components/raw-data-modal';
import reactLogo from '../assets/react.svg'
import openMedeoLogo from '../assets/open-medeo.png'
import viteLogo from '/vite.svg'
import gsapLogo from '../assets/gsap.svg'
import cloudySvg from '../assets/cloudy-still-meteocon.svg';
import freepikLogo from '../assets/freepik-icon.png';

const FooterAttribution = () => {

  return (
    <Box
      sx={(theme) => ({
        position: 'fixed',
        bottom: '7px',
        width: 'fit-content',
        right: '0',
        background: theme.palette.bg.main,
        padding: '10px 5px 0 10px',
        borderRadius: '5px',
        'a': {
          paddingLeft: '11px',
        }
      })}>
      <RawDataModal></RawDataModal>
      <a href="https://gsap.com" target="_blank" title='GSAP used for animations'>
        <img src={gsapLogo} alt="GSAP logo" width="40px" style={{ marginBottom: '7px' }}/>
      </a>
      <a href="http://www.freepik.com" target="_blank" title='Design Inspired By pikisuperstar / Freepik'>
        <img style={{ filter: 'invert(1)' }} src={freepikLogo} width="30px" alt="Freepik Logo" />
      </a>
      <a href="https://basmilius.github.io/weather-icons/index-line.html" target="_blank" title='Meteocons by Basmilius Used For Weather Icons'>
        <img style={{ paddingBottom: '4px' }} src={cloudySvg} width="35px" alt="Meteocons by Basmilius" />
      </a>
      <a href="https://open-meteo.com" target="_blank" title='Open-Meteo Used For Weather Data'>
        <img src={openMedeoLogo} width="30px" alt="Open-meteo logo" />
      </a>
      <a href="https://vite.dev" target="_blank" title='Built With Vite'>
        <img src={viteLogo} alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank" title='Built With React'>
        <img src={reactLogo} alt="React logo" />
      </a>
    </Box>
  );
}

export default FooterAttribution;
