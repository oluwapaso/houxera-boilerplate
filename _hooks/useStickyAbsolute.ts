// import { useEffect, RefObject } from "react";

// export function useStickyAbsolute(barRef: RefObject<HTMLElement | null>, offset = 16) {
//   useEffect(() => {
//     const bar = barRef.current;
//     // the nearest positioned ancestor = your <section className="relative">
//     const section = bar?.offsetParent as HTMLElement | null;
//     if (!bar || !section) return;

//     const getScroller = (): HTMLElement | Window => {
//       let p = section.parentElement;
//       while (p) {
//         const { overflowY } = getComputedStyle(p);
//         if (/(auto|scroll|overlay)/.test(overflowY) && p.scrollHeight > p.clientHeight) return p;
//         p = p.parentElement;
//       }
//       return window;
//     };
//     const scroller = getScroller();

//     let raf = 0;
//     const update = () => {
//       raf = 0;
//       const viewportTop =
//         scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
//       const sectionTop = section.getBoundingClientRect().top;

//       const wanted = viewportTop - sectionTop + offset;             // follow viewport top
//       const max = section.offsetHeight - bar.offsetHeight - offset; // stop at section bottom
//       bar.style.top = `${Math.min(Math.max(offset, wanted), Math.max(offset, max))}px`;
//     };
//     const onScroll = () => {
//       if (!raf) raf = requestAnimationFrame(update);
//     };

//     update();
//     scroller.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     const ro = new ResizeObserver(onScroll);
//     ro.observe(section);

//     return () => {
//       scroller.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onScroll);
//       ro.disconnect();
//       if (raf) cancelAnimationFrame(raf);
//     };
//   }, [barRef, offset]);
// }

import { useEffect, RefObject } from "react";

export function useStickyAbsolute(
  barRef: RefObject<HTMLElement | null>,
  offset = 16,
  /** 0–1. Higher = snappier, lower = more lag / smoother. 0.15–0.25 feels good. */
  smoothness = 0.9
) {
  useEffect(() => {
    const bar = barRef.current;
    const section = bar?.offsetParent as HTMLElement | null;
    if (!bar || !section) return;

    const getScroller = (): HTMLElement | Window => {
      let p = section.parentElement;
      while (p) {
        const { overflowY } = getComputedStyle(p);
        if (/(auto|scroll|overlay)/.test(overflowY) && p.scrollHeight > p.clientHeight) {
          return p;
        }
        p = p.parentElement;
      }
      return window;
    };
    const scroller = getScroller();

    let currentTop = offset;          // the value we actually apply
    let targetTop = offset;           // the ideal position
    let raf = 0;
    let isRunning = true;

    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);

    const computeTarget = () => {
      const viewportTop =
        scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
      const sectionTop = section.getBoundingClientRect().top;

      const wanted = viewportTop - sectionTop + offset;
      const max = section.offsetHeight - bar.offsetHeight - offset;
      return clamp(wanted, offset, Math.max(offset, max));
    };

    const tick = () => {
      if (!isRunning) return;

      targetTop = computeTarget();

      // exponential lerp → smooth lag
      currentTop += (targetTop - currentTop) * smoothness;

      // snap when very close to avoid endless micro-updates
      if (Math.abs(targetTop - currentTop) < 0.5) {
        currentTop = targetTop;
      }

      bar.style.top = `${currentTop}px`;

      // keep the loop alive while we are still catching up or user is scrolling
      if (Math.abs(targetTop - currentTop) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // initial position
    currentTop = targetTop = computeTarget();
    bar.style.top = `${currentTop}px`;

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = new ResizeObserver(onScroll);
    ro.observe(section);

    return () => {
      isRunning = false;
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [barRef, offset, smoothness]);
}