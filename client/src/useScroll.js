import { useState, useEffect } from "react";
import _ from "lodash";

const useScroll = () => {
    const [scrollTarget, setScrollTarget] = useState("bottom");
    const [scrollable, setScrollable] = useState(null);

    useEffect(() => {
        const handleScroll = _.throttle(() => {
            setScrollTarget(
                window.pageYOffset + window.innerHeight / 2 > document.body.clientHeight / 2
                    ? "top"
                    : "bottom"
            );
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
    }, [scrollTarget]);

    return { scrollTarget, scrollable, setScrollable };
};

export default useScroll;
