import "./App.css";
import { useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import useMinLoadingTime from "../hooks/useMinLoadingTime";
import ErrorMessage from "./ErrorMessage";
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
import { TagTooltip } from "./Tag";
import useScroll from "../hooks/useScroll";
import { DEFAULT_SORT, filterEpisodes, sortEpisodes } from "../utils";

function App() {
  const { data, error, isPending } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/episodes`,
  );
  const minLoadingTimeElapsed = useMinLoadingTime(200);
  const [shouldShakeEpisodes, setShouldShakeEpisodes] = useState(false);
  const [listShown, setListShown] = useState("removed");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);

  const episodesShown = useMemo(() => {
    const allEpisodes =
      (listShown === "removed" ? data?.missingEpisodes : data?.shortenedEpisodes) || [];
    return sortEpisodes(filterEpisodes(allEpisodes, searchText), sort);
  }, [data, listShown, searchText, sort]);

  const changeList = (list) => {
    setListShown(list);
    setSearchText("");
    setSort(DEFAULT_SORT);
  };

  const shakeEpisodes = () => {
    setShouldShakeEpisodes(true);
    setTimeout(() => {
      setShouldShakeEpisodes(false);
    }, 1000);
  };

  const { scrollTarget, scrollable } = useScroll();

  const showSkeleton = isPending || !minLoadingTimeElapsed;

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
            <ErrorMessage error={error} />
          ) : (
            <AmountInfo data={data} showSkeleton={showSkeleton} onListChange={changeList} />
          )}
        </section>

        {!error && (
          <section className="right">
            <EpisodeList
              episodes={episodesShown}
              shouldShake={shouldShakeEpisodes}
              showSkeleton={showSkeleton}
              searchText={searchText}
              listShown={listShown}
              onListChange={changeList}
              removedTotal={data?.missingEpisodes?.length || 0}
              shortenedTotal={data?.shortenedEpisodes?.length || 0}
              controls={
                <div className="listControls">
                  <Searchbox
                    resultsCount={episodesShown.length}
                    shakeEpisodes={shakeEpisodes}
                    searchText={searchText}
                    setSearchText={setSearchText}
                  />
                  <Sort listShown={listShown} sort={sort} setSort={setSort} />
                </div>
              }
            />
            <ScrollButton
              showSkeleton={showSkeleton}
              scrollTarget={scrollTarget}
              scrollable={scrollable}
            />
          </section>
        )}
      </div>
      <TagTooltip />
    </div>
  );
}

export default App;
