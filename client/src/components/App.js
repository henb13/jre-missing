import "./App.css";
import { useState, useEffect } from "react";
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
    const [shouldShakeEps, setShouldShakeEps] = useState(false);
    const [episodesShown, setEpisodesShown] = useState([]);

    useEffect(() => {
        setEpisodesShown(data?.missingEpisodes || []);
    }, [data]);

    const shakeEpisodes = () => {
        setShouldShakeEps(true);
        setTimeout(() => {
            setShouldShakeEps(false);
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
                        shouldShake={shouldShakeEps}
                        showSkeleton={showSkeleton}
                    />
                    <Sort setEpisodesShown={setEpisodesShown} />
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
