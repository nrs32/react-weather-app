import { Box, useTheme } from '@mui/material';
import { useMemo } from 'react';

const icons = import.meta.glob('../../assets/weather-icons/*.svg', { eager: true, query: '?url', import: 'default' });

const iconMap: {[name: string]: string} = Object.fromEntries(
  Object.entries(icons).map(([path, url]) => {
    const name = path.split('/').pop();
    return [name, url];
  })
);

const iconGrid = [
  "overcast.svg",
  "sunrise.svg",
  "partly-cloudy-day-snow.svg",
  "fog-night.svg",
  "partly-cloudy-night-sleet.svg",
  "partly-cloudy-night-rain.svg",
  "extreme-night-snow.svg",
  "partly-cloudy-day-rain.svg",
  null,
  "extreme-day-rain.svg",
  "thunderstorms-night-hail.svg",
  null,
  "partly-cloudy-night-drizzle.svg",
  "clear-day.svg",
  "partly-cloudy-day-sleet.svg",
  "fog-day.svg",
  "thunderstorms-night-rain.svg",
  "extreme-day-snow.svg",
  "partly-cloudy-night.svg",
  "thunderstorms-day-rain.svg",
  null,
  "partly-cloudy-day-drizzle.svg",
  "clear-night.svg",
  "sunset.svg",
  "extreme-night-rain.svg",
  "partly-cloudy-night-snow.svg",
  null,
  "thunderstorms-day-hail.svg",
  null,
  "partly-cloudy-day.svg",
];

interface WeatherIconGridProps {
  gridRef: React.Ref<HTMLDivElement>;
  blockCols: number;
  blockRows: number;
  gridCols: number;
  gridRows: number;
  svgSize: number;
  gridGap: number;
  gridPadding: number;
}

const WeatherIconGrid = ({ gridRef, blockCols, blockRows, gridCols, gridRows, svgSize, gridGap, gridPadding }: WeatherIconGridProps) => {
  const theme = useTheme();

  const gridOfGrids = useMemo(() => {
    return [...Array(blockCols * blockRows)].map(() => {
      const gridOfSvgs = iconGrid.map(filename =>
        filename ? iconMap[filename] : null
      );
      return gridOfSvgs;
    });
  }, [blockCols, blockRows]);

  return (
    <Box
      ref={gridRef}
      aria-hidden="true"
      sx={{
        position: 'absolute',
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
        opacity: 0, // before animated into place
        background: theme.palette.bg.main,
      }}
    >
      {gridOfGrids.map((innerGrid, i) => (
        <Box
          key={i}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridCols}, ${svgSize}px)`,
            gridTemplateRows: `repeat(${gridRows}, ${svgSize}px)`,
            gap: `${gridGap}px`,
            padding: `${gridPadding}px`,
          }}
        >
          {innerGrid.map((url, j) => (
            <Box key={j} sx={{ width: svgSize, height: svgSize }}>
              {url ? (
                <img
                  src={url}
                  alt=""
                  role="presentation"
                  width={svgSize}
                  height={svgSize}
                  style={{ objectFit: 'contain' }}
                />
              ) : null}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default WeatherIconGrid;
