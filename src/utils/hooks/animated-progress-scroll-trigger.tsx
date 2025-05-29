import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

interface useAnimatedProgressScrollTriggerProps {
  elementId: string;
  value: number;
  throttledSetAnimatedValue: (v: number) => void;
	setAnimatedValue: (val: number) => void;
  valueRef: React.RefObject<{ v: number }>;
}

export default function useAnimatedProgressScrollTrigger({
  elementId,
  value,
  throttledSetAnimatedValue,
	setAnimatedValue,
  valueRef,
}: useAnimatedProgressScrollTriggerProps) {
  useEffect(() => {
    if (!valueRef.current) return;

    const tween = gsap.to(valueRef.current, {
      duration: value / 75, // so every progress appears at each % at the same time. 100% takes 1.3 sec, 33 takes .44 sec etc.
      v: value,
      ease: 'none',
      onUpdate: () => {
        throttledSetAnimatedValue(Math.round(valueRef.current.v));
      },
			onComplete: () => {
				// Ensure the final value is set when animation finishes
				// as throttling could miss the last value
				setAnimatedValue(Math.round(valueRef.current.v)); 
			},
      delay: .3,
      paused: true, // So we don't run until we are scroll-triggered
      immediateRender: false,
    });

    const startTrigger = ScrollTrigger.create({
      trigger: `#${elementId}`,
      start: 'bottom bottom',
      end: 'bottom bottom',
      onEnter: () => {
        tween.restart(true);
      },
    });

    const endTrigger = ScrollTrigger.create({
      trigger: `#${elementId}`,
      start: 'top bottom',
      end: 'top bottom',
      onLeaveBack: () => {
        tween.pause(0);
        throttledSetAnimatedValue(0);
      },
    });

    return () => {
      startTrigger.kill();
      endTrigger.kill();
      tween.kill();
    };
  }, [elementId, value, throttledSetAnimatedValue, valueRef]);
}
