import { Box, Typography, useTheme } from '@mui/material';
import type { WeatherCodeInfo } from '../types/weather-types';
import LoopingConveyerText from './looping-conveyer-text';

type AtAGlanceDayProps = {
  weatherCodeInfo: WeatherCodeInfo;
  isDay: boolean;
  date: string;
  dayOfWeek: string;
  tempMax: number;
  tempMin: number;
};

const AtAGlanceDay = ({ weatherCodeInfo, isDay, date, dayOfWeek, tempMax, tempMin }: AtAGlanceDayProps) => {
  const theme = useTheme();
  const MIN_WIDTH = 150;
  const PADDING = 16;

  const icons = import.meta.glob('../assets/weather-icons/*.svg', { eager: true, query: '?url', import: 'default' });
  const iconPaths = Object.entries(icons) as [string, string][];

  let svg: string = '';
  let svgAlt: string = '';

  if (isDay) {
    svg = iconPaths.find(([path]) => path.endsWith(`${weatherCodeInfo.dayIcon}.svg`))![1];
    svgAlt = weatherCodeInfo.dayIcon;

  } else {
    svg = iconPaths.find(([path]) => path.endsWith(`${weatherCodeInfo.nightIcon}.svg`))![1];
    svgAlt = weatherCodeInfo.nightIcon;
  }

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.cardBg.light}`,
        background: theme.palette.bg.main,
        borderRadius: '8px',
        minWidth: MIN_WIDTH,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: `${PADDING}px`,
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>{dayOfWeek}</Typography>
      <Typography sx={{ fontSize: '17px', fontWeight: 700, marginTop: '-6px' }}>{date}</Typography>

      <img
        src={svg}
        alt={svgAlt}
        width={95}
        height={95}
        style={{ objectFit: 'contain', marginTop: '-15px' }}
      />
      <Box title={weatherCodeInfo.desc.toUpperCase()} sx={{ overflow: 'hidden', width: '100%', marginTop: '-12px' }}>
        <LoopingConveyerText text={weatherCodeInfo.desc.toUpperCase()} containerWidth={MIN_WIDTH - (PADDING*2)}/>
      </Box>
      <Typography variant="h6">{Math.round(tempMax)}° / {Math.round(tempMin)}</Typography>
    </Box>
  );
};

export default AtAGlanceDay;


