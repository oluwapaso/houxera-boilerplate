import { useEffect, RefObject } from "react";

export function useStickyAbsolute(barRef: RefObject<HTMLElement | null>, offset = 16) {
  useEffect(() => {
    const bar = barRef.current;
    // the nearest positioned ancestor = your <section className="relative">
    const section = bar?.offsetParent as HTMLElement | null;
    if (!bar || !section) return;

    const getScroller = (): HTMLElement | Window => {
      let p = section.parentElement;
      while (p) {
        const { overflowY } = getComputedStyle(p);
        if (/(auto|scroll|overlay)/.test(overflowY) && p.scrollHeight > p.clientHeight) return p;
        p = p.parentElement;
      }
      return window;
    };
    const scroller = getScroller();

    let raf = 0;
    const update = () => {
      raf = 0;
      const viewportTop =
        scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
      const sectionTop = section.getBoundingClientRect().top;

      const wanted = viewportTop - sectionTop + offset;             // follow viewport top
      const max = section.offsetHeight - bar.offsetHeight - offset; // stop at section bottom
      bar.style.top = `${Math.min(Math.max(offset, wanted), Math.max(offset, max))}px`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = new ResizeObserver(onScroll);
    ro.observe(section);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [barRef, offset]);
}