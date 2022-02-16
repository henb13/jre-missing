import "./App.css";
import { useState } from "react";
import useFetch from "../hooks/useFetch";
import useMinLoadingTime from "../hooks/useMinLoadingTime";
import Error from "./Error";
import Github from "./Github";
import Header from "./Header";
import AmountMissing from "./AmountMissing";
import EpisodeList from "./EpisodeList";
import Searchbox from "./Searchbox";
import ScrollButton from "./ScrollButton";
import Contact from "./Contact";

function App() {
    const { data, error, isPending } = useFetch("/api/episodes");
    const minLoadingTimeElapsed = useMinLoadingTime(400);
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
                        <AmountMissing
                            setSearchText={setSearchText}
                            data={data}
                            shakeEpisodes={shakeEpisodes}
                            listLength={episodesShown?.length}
                            showSkeleton={showSkeleton}
                        />

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
                    <EpisodeList
                        episodesShown={episodesShown}
                        shouldShake={shouldShakeEps}
                        showSkeleton={showSkeleton}
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
