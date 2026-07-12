import { useState, useEffect } from "react";
import throttle from "lodash/throttle";

const useScroll = () => {
  const [scrollTarget, setScrollTarget] = useState("bottom");
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollTarget(
        window.scrollY + window.innerHeight / 2 > document.body.clientHeight / 2
          ? "top"
          : "bottom"
      );
    }, 200);

    const handleResize = throttle(() => {
      handleScroll();
      setScrollable(document.body.clientHeight > window.innerHeight);
    }, 200);

    // fires on observe and whenever content changes the body height
    const observer = new ResizeObserver(handleResize);
    observer.observe(document.body);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      handleScroll.cancel();
      handleResize.cancel();
    };
  }, []);

  return { scrollTarget, scrollable };
};

export default useScroll;
