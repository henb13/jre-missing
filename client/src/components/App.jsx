import "./App.css";
import { useState, useEffect } from "react";
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
  const { data, error, isPending } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/episodes`,
  );
  const minLoadingTimeElapsed = useMinLoadingTime(200);
  const [shouldShakeEpisodes, setShouldShakeEpisodes] = useState(false);
  const [missingEpisodesShown, setMissingEpisodesShown] = useState([]);
  const [shortenedEpisodesShown, setShortenedEpisodesShown] = useState([]);
  const [listShown, setListShown] = useState("removed");
  const [searchText, setSearchText] = useState("");

  const listMap = {
    removed: {
      episodes: missingEpisodesShown,
      allEpisodes: data?.missingEpisodes || [],
      setEpisodes: setMissingEpisodesShown,
    },
    shortened: {
      episodes: shortenedEpisodesShown,
      allEpisodes: data?.shortenedEpisodes || [],
      setEpisodes: setShortenedEpisodesShown,
    },
  };

  const currentList = listMap[listShown];

  const shakeEpisodes = () => {
    setShouldShakeEpisodes(true);
    setTimeout(() => {
      setShouldShakeEpisodes(false);
    }, 1000);
  };

  useEffect(() => {
    setMissingEpisodesShown(data?.missingEpisodes || []);
    setShortenedEpisodesShown(data?.shortenedEpisodes || []);
  }, [data]);

  const { scrollTarget, scrollable } = useScroll({
    refreshOnChange: [missingEpisodesShown, shortenedEpisodesShown, listShown, searchText],
  });

  const showSkeleton = isPending || !minLoadingTimeElapsed;

  const resetCurrentEpisodes = () => {
    currentList.setEpisodes(currentList.allEpisodes);
    setSearchText("");
  };

  return (
    <div className="App">
      <header className="topbar">
        <Github />
        <div className="topbarActions">
          <Sponsor />
          <Coffee />
          <Contact />
        </div>
      </header>

      <div className="layout">
        <section className="left">
          <Header />
          {error ? (
            <Error error={error} />
          ) : (
            <AmountInfo data={data} showSkeleton={showSkeleton} setListShown={setListShown} />
          )}
        </section>

        {!error && (
          <section className="right">
            <EpisodeList
              missingEpisodesShown={missingEpisodesShown}
              shortenedEpisodesShown={shortenedEpisodesShown}
              shouldShake={shouldShakeEpisodes}
              showSkeleton={showSkeleton}
              searchText={searchText}
              listShown={listShown}
              setListShown={setListShown}
              resetCurrentEpisodes={resetCurrentEpisodes}
              removedTotal={data?.missingEpisodes?.length || 0}
              shortenedTotal={data?.shortenedEpisodes?.length || 0}
              controls={
                <div className="listControls">
                  <Searchbox
                    {...currentList}
                    shakeEpisodes={shakeEpisodes}
                    searchText={searchText}
                    setSearchText={setSearchText}
                  />
                  <Sort
                    listShown={listShown}
                    setEpisodes={currentList.setEpisodes}
                    episodes={currentList.episodes}
                  />
                </div>
              }
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
    </div>
  );
}

export default App;
