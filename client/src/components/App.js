import "./App.css";
import { useState, useEffect, useRef } from "react";
import useFetch from "../hooks/useFetch";
import useMinLoadingTime from "../hooks/useMinLoadingTime";
import Error from "./Error";
import Github from "./Github";
import Header from "./Header";
import AmountInfo from "./AmountInfo";
import EpisodeList from "./EpisodeList";
import Sort from "./Sort";
import Searchbox from "./Searchbox";
import ScrollButton from "./ScrollButton";
import Contact from "./Contact";
import Sponsor from "./Sponsor";
import Coffee from "./Coffee";
import useScroll from "../hooks/useScroll";

function App() {
  const { data, error, isPending } = useFetch("/api/episodes");
  const minLoadingTimeElapsed = useMinLoadingTime(400);
  const [shouldShakeEpisodes, setShouldShakeEpisodes] = useState(false);
  const [missingEpisodesShown, setMissingEpisodesShown] = useState([]);
  const [shortenedEpisodesShown, setShortenedEpisodesShown] = useState([]);
  const [listShown, setListShown] = useState("removed");

  const searchRef = useRef();

  useEffect(() => {
    setMissingEpisodesShown(data?.missingEpisodes || []);
    setShortenedEpisodesShown(data?.shortenedEpisodes || []);
  }, [data]);

  const shakeEpisodes = () => {
    setShouldShakeEpisodes(true);
    setTimeout(() => {
      setShouldShakeEpisodes(false);
    }, 1000);
  };

  const { scrollTarget, scrollable } = useScroll({
    refreshOnChange: [missingEpisodesShown, shortenedEpisodesShown, listShown],
  });

  const showSkeleton = isPending || !minLoadingTimeElapsed;

  return (
    <div className="App">
      <section className="left">
        <Github />
        <Sponsor />
        <Coffee />
        <Header />
        <Contact />
        {error ? (
          <Error error={error} />
        ) : (
          <>
            <AmountInfo data={data} showSkeleton={showSkeleton} />
            <Searchbox
              ref={searchRef}
              missingEpisodesShown={missingEpisodesShown}
              setMissingEpisodesShown={setMissingEpisodesShown}
              shakeEpisodes={shakeEpisodes}
              allEpisodes={data?.missingEpisodes}
            />
          </>
        )}
      </section>

      {!error && (
        <section className="right">
          <Sort
            setMissingEpisodesShown={setMissingEpisodesShown}
            allEpisodes={data?.missingEpisodes}
          />
          <EpisodeList
            missingEpisodesShown={missingEpisodesShown}
            shortenedEpisodesShown={shortenedEpisodesShown}
            shouldShake={shouldShakeEpisodes}
            showSkeleton={showSkeleton}
            searchRef={searchRef}
            listShown={listShown}
            setListShown={setListShown}
          />
          <ScrollButton
            dataPending={isPending}
            minLoadingTimeElapsed={minLoadingTimeElapsed}
            scrollTarget={scrollTarget}
            scrollable={scrollable}
          />
        </section>
      )}
    </div>
  );
}

export default App;
