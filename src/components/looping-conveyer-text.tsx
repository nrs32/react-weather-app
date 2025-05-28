import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import gsap from 'gsap';
import { useTheme } from '@emotion/react';

/* THIS COMPONENT WAS WRITTEN BY CHAT GPT (& MODIFIED) */

type LoopingConveyerTextProps = {
  text: string;
  containerWidth: number;
};

const LoopingConveyerText = ({ text, containerWidth }: LoopingConveyerTextProps) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const contentWidth = content.scrollWidth;
    const textIsOverflowing = contentWidth > containerWidth;

    if (!textIsOverflowing) {
      setShouldAnimate(false);

    } else {
      setShouldAnimate(true);
      const textGap = 30;
      const distance = contentWidth + textGap;

      // Clone content for seamless looping
      const clone = content.cloneNode(true) as HTMLDivElement;
      clone.style.position = 'absolute';
      clone.style.left = `${contentWidth + textGap}px`; // Adds a gap between loops
      clone.style.top = '0';

      container.appendChild(clone);

      // Animate both original and clone together
      gsap.to(container, {
        x: `-=${distance}`, // Move text left for the full width + gap
        duration: distance / 25, // distance / time = speed;
        ease: 'none',
        repeat: -1, // Loop forever
        modifiers: {
          // (Current position % distance) outputs values between 0 and distance to create our looping logic
          x: gsap.utils.unitize(x => parseFloat(x) % (distance)),
        },
      });
    } 

    return () => {
      gsap.killTweensOf(container);
    };
  }, [text]);

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
        display: 'flex',
        justifyContent: shouldAnimate ? 'flex-start' : 'center',
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <Box ref={contentRef} sx={{ fontWeight: 700, fontSize: '12px', letterSpacing: theme.palette.text.secondaryLetterSpacing, color: theme.palette.text.primary }}>
          {text}
        </Box>
      </Box>
    </Box>
  );
};

export default LoopingConveyerText;
