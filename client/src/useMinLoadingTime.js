import { useState, useEffect } from "react";

const useMinLoadingTime = minTime => {
  const [minTimeElapsed, setMinTimeElapsed] = useState(true);

  useEffect(() => {
    setMinTimeElapsed(false);

    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minTime);

    return () => {
      clearTimeout(timer);
    };
  }, [minTime]);

  return minTimeElapsed;
};

export default useMinLoadingTime;
