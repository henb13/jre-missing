import { useState, useEffect } from "react";

const useMinLoadingTime = (minTime) => {
  const [minLoadingTimeElapsed, setMinLoadingTimeElapsed] = useState(true);

  useEffect(() => {
    setMinLoadingTimeElapsed(false);

    const timer = setTimeout(() => {
      setMinLoadingTimeElapsed(true);
    }, minTime);

    return () => {
      clearTimeout(timer);
    };
  }, [minTime]);

  return minLoadingTimeElapsed;
};

export default useMinLoadingTime;
