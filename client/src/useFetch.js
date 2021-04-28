import { useState, useEffect } from "react";

const useFetch = url => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw Error(
            res.status == 429
              ? "You are making too many requests, please try again later."
              : "Something went wrong, please try again later."
          );
        }
        return res.json();
      })
      .then(data => {
        setIsPending(false);
        setError(null);
        setData(data);
      })
      .catch(err => {
        setIsPending(false);
        console.log("err: " + err);
        setError(err.message);
      });
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;
