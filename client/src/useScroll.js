import { useState, useEffect } from "react";
import _ from "lodash";

const useScroll = () => {
  const [scrollDirection, setScrollDirection] = useState("down");
  const [scrollable, setScrollable] = useState(null);

  useEffect(() => {
    const handleScroll = _.throttle(() => {
      if (
        window.pageYOffset + window.innerHeight / 2 >
        document.body.clientHeight / 2
      ) {
        if (scrollDirection === "down") {
          setScrollDirection("up");
        }
      } else if (scrollDirection === "up") {
        setScrollDirection("down");
      }
    }, 200);

    const handleResize = _.throttle(() => {
      handleScroll();
      setScrollable(document.body.clientHeight > window.innerHeight);
    }, 200);

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    window.addEventListener("resize", handleResize, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollDirection]);

  return { scrollDirection, scrollable, setScrollable };
};

export default useScroll;
