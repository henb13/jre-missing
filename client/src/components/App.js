import "./App.css";
import { useState } from "react";
// import { useState, useEffect, useRef } from "react";
import useFetch from "../useFetch";
import useMinLoadingTime from "../useMinLoadingTime";
import Github from "./Github";
import Header from "./Header";
import AmountMissing from "./AmountMissing";
import EpisodeList from "./EpisodeList";
import Searchbox from "./Searchbox";
import ScrollButton from "./ScrollButton";
import Contact from "./Contact";
import SkeletonList from "../skeletons/SkeletonList";
import SkeletonText from "../skeletons/SkeletonText";
import { ReactComponent as AlertIcon } from "../icons/alertIcon.svg";

function App() {
    const { data, error, isPending } = useFetch("/api/episodes");
    const minLoadingTime = useMinLoadingTime(400);
    const [searchText, setSearchText] = useState("");
    const [shouldShakeEps, setShouldShakeEps] = useState(false);

    const episodesShown = data?.missingEpisodes?.filter((ep) =>
        ep.full_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const shakeEpisodes = () => {
        setShouldShakeEps(true);
        setTimeout(() => {
            setShouldShakeEps(false);
        }, 1000);
    };

    const showSkeleton = isPending || !minLoadingTime;

    return (
        <div className="App">
            <section className="left">
                <Github />
                <Header />
                <Contact />
                {error ? (
                    <div className="error">
                        <AlertIcon className="error-icon" />
                        {error}
                    </div>
                ) : (
                    <>
                        {showSkeleton ? (
                            <SkeletonText />
                        ) : (
                            data && (
                                <AmountMissing
                                    setSearchText={setSearchText}
                                    data={data}
                                    shakeEpisodes={shakeEpisodes}
                                    listLength={episodesShown.length}
                                />
                            )
                        )}
                        <Searchbox
                            searchText={searchText}
                            episodesShown={episodesShown}
                            handleSearch={handleSearch}
                            shakeEpisodes={shakeEpisodes}
                        />
                    </>
                )}
            </section>

            {!error && (
                <section className="right">
                    {showSkeleton ? (
                        <SkeletonList />
                    ) : (
                        episodesShown && (
                            <EpisodeList
                                episodesShown={episodesShown}
                                shouldShake={shouldShakeEps}
                            />
                        )
                    )}

                    <ScrollButton
                        dataPending={isPending}
                        minLoadingTime={minLoadingTime}
                        episodesShown={episodesShown}
                    />
                </section>
            )}
        </div>
    );
}

export default App;
