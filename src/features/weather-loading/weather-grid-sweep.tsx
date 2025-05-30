import { useRef, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { gsap } from 'gsap';
import WeatherIconGrid from './weather-icon-grid';

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

const WeatherGridSweep = () => {
  const gridContainerA = useRef<HTMLDivElement>(null);
  const gridContainerB = useRef<HTMLDivElement>(null);

  const { blockCols, blockRows } = useMemo(() => {
    // Only run during render or resize
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const diagonal = Math.sqrt(screenW ** 2 + screenH ** 2);

    const blockCols = Math.ceil(diagonal / BLOCK_WIDTH) + 2;
    const blockRows = Math.ceil(diagonal / BLOCK_HEIGHT) + 2;

    return { blockCols, blockRows };
  }, [window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const containerA = gridContainerA.current;
    const containerB = gridContainerB.current;

    if (!containerA || !containerB) return;

    // combined grid width and height
    const totalX = blockCols * BLOCK_WIDTH;
    const totalY = blockRows * BLOCK_HEIGHT;

    // (0, 0) is top left of window. 
    // (x, y) positions are moving top left of icon grid to the window coord.
    const startX = window.innerWidth; // off screen right
    const endX = window.innerWidth / 2 - totalX; // middle of screen

    const startY = -totalY; // off screen top
    const endY = window.innerHeight / 2; // middle of screen

    const duration = 18;

    const animate = (target: HTMLDivElement, offsetX = 0, offsetY = 0, delay = 0) => {
      gsap.set(target, { x: startX + offsetX, y: startY + offsetY, opacity: 1 });

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

    return () => {
      // kill animations on unmount
      gsap.killTweensOf(containerA);
      gsap.killTweensOf(containerB);
    };
  }, [blockCols, blockRows]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: 'calc(100vw - 10px)',
        height: 'calc(100vh - 16px)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: `${blockCols * BLOCK_WIDTH}px`,
          height: `${blockRows * BLOCK_HEIGHT}px`,
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <WeatherIconGrid
          gridRef={gridContainerA} 
          blockCols={blockCols} 
          blockRows={blockRows} 
          gridCols={GRID_COLS}
          gridRows={GRID_ROWS}
          svgSize={SVG_SIZE}
          gridGap={GAP}
          gridPadding={PADDING}/>

        <WeatherIconGrid 
          gridRef={gridContainerB} 
          blockCols={blockCols} 
          blockRows={blockRows}
          gridCols={GRID_COLS}
          gridRows={GRID_ROWS}
          svgSize={SVG_SIZE}
          gridGap={GAP}
          gridPadding={PADDING}/>
      </Box>
    </Box>
  );
};

export default WeatherGridSweep;

