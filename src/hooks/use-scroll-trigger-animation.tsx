import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UseScrollTriggeredChartDataOptions {
  ref: React.RefObject<HTMLElement | null>;
  setDefaultData: () => void;
  setActualData: () => void;
}

// Not written the best, originally animated actual clipPath, but extract out to npm pkg and now do this
export const useScrollTriggeredChartData = ({
  ref,
  setDefaultData,
  setActualData,
}: UseScrollTriggeredChartDataOptions) => {
  useEffect(() => {
    // This effect re-animates on scroll triggers
    if (!ref.current) return;

		// Reset the graph no data so we re-animate on data changes
    setDefaultData();

		// Use gsap to tween on the clipPath rect element
    const startTrigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'bottom bottom',
      end: 'bottom bottom',
      onEnter: () => {
        // when we're scrolling down and the bottom of the svg hits the bottom of the view port

        // Why this set to default and then timeout?
        // To avoid data flicker. 
        // Basically, we set the data to nothing, triggering re-animation with no data, thereby triggering clipPath width to 0
        // Then 10ms later set the actual data, the data updates and then the re-animation triggers, but since clipPath was already 0, it looks flawless
        // Otherwise the data updates, graph shows, then reset to clipPath width 0, then animates.
        setDefaultData();

        setTimeout(() => {
          setActualData();
        }, 10);
        ////////////////////////////////
      },
    });

    const endTrigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'top bottom',
      onLeaveBack: () => {
        setDefaultData(); 
      },
    });

    return () => {
      startTrigger.kill();
      endTrigger.kill();
    };
  }, [ref, setDefaultData, setActualData]);
};
