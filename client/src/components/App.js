import "./App.css";
import { useState, useEffect, useRef } from "react";
import useFetch from "../useFetch";
import useMinLoadingTime from "../useMinLoadingTime";

import Github from "./Github";
import Header from "./Header";
import AmountMissing from "./AmountMissing";
import EpisodeList from "./EpisodeList";
import Searchbox from "./Searchbox";
import ScrollButton from "./ScrollButton";

import SkeletonList from "../skeletons/SkeletonList";
import SkeletonText from "../skeletons/SkeletonText";
import { ReactComponent as AlertIcon } from "../icons/alertIcon.svg";

function App() {
  const { data, error, isPending } = useFetch("/api/episodes");
  const minLoadingTime = useMinLoadingTime(400);
  const [searchText, setSearchText] = useState("");
  const [missingEpisodes, setMissingEpisodes] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isFirstUpdate = useRef(true);

  useEffect(() => {
    setMissingEpisodes(data?.episodes);
  }, [data]);

  useEffect(() => {
    if (isFirstUpdate.current) {
      isFirstUpdate.current = false;
    } else {
      setMissingEpisodes(() =>
        data?.episodes.filter(ep =>
          ep.full_name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, data]);

  const handleSearch = e => {
    setSearchText(e.target.value);
  };

  const shakeEpisodes = () => {
    setShouldAnimate(true);
    setTimeout(() => {
      setShouldAnimate(false);
    }, 1000);
  };

  return (
    <div className="App">
      <section className="left">
        <Github />
        <Header />
        {(error && (
          <div className="error">
            <AlertIcon className="error-icon" />
            {error}
          </div>
        )) || (
          <>
            {isPending || !minLoadingTime ? (
              <SkeletonText />
            ) : (
              data && (
                <AmountMissing
                  setSearchText={setSearchText}
                  data={data}
                  shakeEpisodes={shakeEpisodes}
                  missingEpisodes={missingEpisodes}
                />
              )
            )}
            <Searchbox
              searchText={searchText}
              missingEpisodes={missingEpisodes}
              handleSearch={handleSearch}
              shakeEpisodes={shakeEpisodes}
            />
          </>
        )}
      </section>

      {!error && (
        <section className="right">
          {isPending || !minLoadingTime ? (
            <SkeletonList />
          ) : (
            missingEpisodes && (
              <EpisodeList
                episodes={missingEpisodes}
                shouldAnimate={shouldAnimate}
              />
            )
          )}

          <ScrollButton
            isPending={isPending}
            minLoadingTime={minLoadingTime}
            missingEpisodes={missingEpisodes}
          />
        </section>
      )}
    </div>
  );
}

export default App;
