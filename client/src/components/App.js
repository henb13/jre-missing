import "./App.css";
import { useState, useEffect, useRef } from "react";
import useFetch from "../hooks/useFetch";
import useMinLoadingTime from "../hooks/useMinLoadingTime";
import Error from "./Error";
import Github from "./Github";
import Header from "./Header";
import AmountMissing from "./AmountMissing";
import EpisodeList from "./EpisodeList";
import Sort from "./Sort";
import Searchbox from "./Searchbox";
import ScrollButton from "./ScrollButton";
import Contact from "./Contact";

function App() {
  const { data, error, isPending } = useFetch("/api/episodes");
  const minLoadingTimeElapsed = useMinLoadingTime(400);
  const [shouldShakeEpisodes, setShouldShakeEpisodes] = useState(false);
  const [episodesShown, setEpisodesShown] = useState([]);
  const searchRef = useRef();

  useEffect(() => {
    setEpisodesShown(data?.missingEpisodes || []);
  }, [data]);

  const shakeEpisodes = () => {
    setShouldShakeEpisodes(true);
    setTimeout(() => {
      setShouldShakeEpisodes(false);
    }, 1000);
  };

  const showSkeleton = isPending || !minLoadingTimeElapsed;

  return (
    <div className="App">
      <section className="left">
        <Github />
        <Header />
        <Contact />
        {error ? (
          <Error error={error} />
        ) : (
          <>
            <AmountMissing data={data} showSkeleton={showSkeleton} />
            <Searchbox
              ref={searchRef}
              episodesShown={episodesShown}
              setEpisodesShown={setEpisodesShown}
              shakeEpisodes={shakeEpisodes}
            />
          </>
        )}
      </section>

      {!error && (
        <section className="right">
          <EpisodeList
            episodesShown={episodesShown}
            shouldShake={shouldShakeEpisodes}
            showSkeleton={showSkeleton}
          />
          <Sort
            setEpisodesShown={setEpisodesShown}
            searchRef={searchRef}
            allEpisodes={data?.missingEpisodes}
          />
          <ScrollButton
            dataPending={isPending}
            minLoadingTimeElapsed={minLoadingTimeElapsed}
            episodesShown={episodesShown}
          />
        </section>
      )}
    </div>
  );
}

export default App;
