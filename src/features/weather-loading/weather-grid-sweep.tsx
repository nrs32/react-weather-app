import { useRef, useEffect, useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import { gsap } from 'gsap';

const SVG_SIZE = 120;
const GRID_COLS = 5;
const GRID_ROWS = 6;
const GAP = 10;
const PADDING = 10;
const BLOCK_WIDTH =
  SVG_SIZE * GRID_COLS +
  GAP * (GRID_COLS - 1) +
  PADDING * 2;

const BLOCK_HEIGHT =
  SVG_SIZE * GRID_ROWS +
  GAP * (GRID_ROWS - 1) +
  PADDING * 2;

const icons = import.meta.glob('../../assets/weather-icons/*.svg', { eager: true, query: '?url', import: 'default' });

const iconMap = Object.fromEntries(
  Object.entries(icons).map(([path, url]) => {
    const name = path.split('/').pop(); // e.g. "overcast.svg"
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

const WeatherGridSweep = () => {
  const theme = useTheme();
  const gridContainerA = useRef<HTMLDivElement>(null);
  const gridContainerB = useRef<HTMLDivElement>(null);

  const { blockCols, blockRows } = useMemo(() => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const diagonal = Math.sqrt(screenW ** 2 + screenH ** 2);

    const blockCols = Math.ceil(diagonal / BLOCK_WIDTH) + 2;
    const blockRows = Math.ceil(diagonal / BLOCK_HEIGHT) + 2;

    return { blockCols, blockRows };
  }, []);

  useEffect(() => {
    const containerA = gridContainerA.current;
    const containerB = gridContainerB.current;

    if (!containerA || !containerB) return;

    const totalX = blockCols * BLOCK_WIDTH;
    const totalY = blockRows * BLOCK_HEIGHT;

    const startX = window.innerWidth;
    const endX = window.innerWidth / 2 - totalX;

    const startY = -totalY;
    const endY = window.innerHeight / 2;

    const duration = 18;

    const animate = (target: HTMLDivElement, offsetX = 0, offsetY = 0, delay = 0) => {
      gsap.set(target, { x: startX + offsetX, y: startY + offsetY });

      gsap.to(target, {
        x: endX + offsetX,
        y: endY + offsetY,
        duration: duration,
        ease: "none",
        delay: delay,
        onComplete: () => animate(target, offsetX, offsetY, 0), // loop infinitely
      });
    };

    animate(containerA, 0, 0, 0);
    animate(containerB, -29, 50, duration / 2); // second grid offset & delayed start

    // Cleanup function to kill animations on unmount
    return () => {
      gsap.killTweensOf(containerA);
      gsap.killTweensOf(containerB);
    };
  }, [blockCols, blockRows]);

  const blocks = useMemo(() => {
    const grid = [...Array(blockCols * blockRows)].map(() => {
      const blockIcons = iconGrid.map(filename =>
        filename ? iconMap[filename] : null
      );
      return blockIcons;
    });

    return grid;
  }, [blockCols, blockRows]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Container for both grids */}
      <Box
        sx={{
          position: 'absolute',
          width: `${blockCols * BLOCK_WIDTH}px`,
          height: `${blockRows * BLOCK_HEIGHT}px`,
          top: 0,
          left: 0,
          pointerEvents: 'none', // optional: let clicks through
        }}
      >
        {/* First grid */}
        <Box
          ref={gridContainerA}
          sx={{
            position: 'absolute',
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            height: '100%',
            background: theme.palette.bg.main,
          }}
        >
          {blocks.map((blockIcons, i) => (
            <Box
              key={i}
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_COLS}, ${SVG_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, ${SVG_SIZE}px)`,
                gap: `${GAP}px`,
                padding: `${PADDING}px`,
              }}
            >
              {blockIcons.map((url, j) => (
                <Box key={j} sx={{ width: SVG_SIZE, height: SVG_SIZE }}>
                  {url ? (
                    <img
                      src={url}
                      alt=""
                      width={SVG_SIZE}
                      height={SVG_SIZE}
                      style={{ objectFit: 'contain' }}
                    />
                  ) : null}
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        {/* Second grid */}
        <Box
          ref={gridContainerB}
          sx={{
            position: 'absolute',
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            height: '100%',
            background: theme.palette.bg.main,
          }}
        >
          {blocks.map((blockIcons, i) => (
            <Box
              key={i}
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_COLS}, ${SVG_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, ${SVG_SIZE}px)`,
                gap: `${GAP}px`,
                padding: `${PADDING}px`,
              }}
            >
              {blockIcons.map((url, j) => (
                <Box key={j} sx={{ width: SVG_SIZE, height: SVG_SIZE }}>
                  {url ? (
                    <img
                      src={url}
                      alt=""
                      width={SVG_SIZE}
                      height={SVG_SIZE}
                      style={{ objectFit: 'contain' }}
                    />
                  ) : null}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WeatherGridSweep;

