/** @jsxImportSource @emotion/react */
import { type Point } from '../../types/graph-types';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import usePrevious from '../../utils/use-previous-hook';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type GradientDirection = 'v' | 'h'; // vertical or horizontal

export interface CurvyTimeGraphAnimatorProps {
  id: string;
  data: Point[];
  width: number;

	// children allows us to be a wrapper component and pass refs to the child graph without defining the child graph here
	// This way we don't need to pass child graph props to this animator wrapper
	// example use:
	// <CurvyTimeGraphAnimator>
	// 	{(refs) => (
	// 		<CurvyTimeGraph
	// 			animationRefs={refs}
	// 		/>
	// 	)}
	// </CurvyTimeGraphAnimator>
	children: (refs: {
    clipPathRect: React.Ref<SVGRectElement>;
    svgRoot: React.Ref<SVGSVGElement>;
  }) => React.ReactNode;
}

const CurvyTimeGraphAnimator: React.FC<CurvyTimeGraphAnimatorProps> = ({ id, data, width, children }) => {
  const prevData = usePrevious(data);
	const clipPathRectRef = useRef<SVGRectElement>(null);
	const svgRootRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // This effect re-animates on scroll triggers (not data)
		if (!clipPathRectRef.current || !svgRootRef.current) return;

    // Reset the graph to width 0 so we re-animate on data changes
    gsap.set(clipPathRectRef.current, { attr: { width: 0 } });

    // Use gsap to tween on the clipPath rect element (by id) 
    const tween = gsap.to(clipPathRectRef.current, {
      scrollTrigger: {
        trigger: svgRootRef.current,
        start: 'bottom bottom', // when the bottom of the SVG hits bottom of viewport we start animation
        end: 'top bottom', // when the top of the SVG hits the bottom of the viewport we leave animation zone
        toggleActions: 'play none reverse none', // play onEnter, onLeave, onEnterBack, onLeaveBack
      },

      duration: 2, // seconds

      // animate the width attribute of clipPath rect from its set width (0) to the width we specify here
      attr: { width },

      // start reveal quickly and then slow down (out)
      // use power2 which is a steeper speed curve than the default of 1, for a more pronounced deceleration.
      ease: 'power2.out',
    });

    return () => {
      // if this component unmounts or id changes
      // cleanup gsap animation and scrollTriggers for this graph 
      tween.scrollTrigger?.kill();
      tween.kill();
    };

  }, [id, width]);

  
  useEffect(() => {
    // This effect re-animates on data changes (not scroll triggers)

    const weHaveNoData = !data || data.length === 0;
    const dataHasNoChanges = JSON.stringify(prevData) === JSON.stringify(data);
		
    if (weHaveNoData || dataHasNoChanges) return;
		if (!clipPathRectRef.current || !svgRootRef.current) return;

    // Check if the chart is currently in the viewport
    const inViewport = ScrollTrigger.isInViewport(svgRootRef.current);

    if (!inViewport) return;

    // Reset the graph to width 0 so we re-animate on data changes
    gsap.set(clipPathRectRef.current, { attr: { width: 0 } });

    // Use gsap to tween on the clipPath rect element (by id) 
    const tween = gsap.to(clipPathRectRef.current, {
      duration: 2, // seconds

      // animate the width attribute of clipPath rect from its set width (0) to the width we specify here
      attr: { width },

      // start reveal quickly and then slow down (out)
      // use power2 which is a steeper speed curve than the default of 1, for a more pronounced deceleration.
      ease: 'power2.out',
    });

    return () => {
      // if this component unmounts or id changes
      // cleanup gsap animation and scrollTriggers for this graph 
      tween.kill();
    };
  }, [data]);

  return <>{children({ clipPathRect: clipPathRectRef, svgRoot: svgRootRef })}</>;
};

export default CurvyTimeGraphAnimator;
