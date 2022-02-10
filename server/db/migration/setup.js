const missingEpsPerNow = require("./missingEpsPerNow");
const getSpotifyEpisodeNames = require("../../lib/getSpotifyEpisodeNames");
const getEpisodeNumber = require("../../lib/getEpisodeNumber");
const pool = require("../connect");

require("dotenv").config();

getSpotifyEpisodeNames().then(async (episodes) => {
    episodes = episodes.concat(missingEpsPerNow);
    episodes.sort((a, b) => getEpisodeNumber(a) - getEpisodeNumber(b));

    await (async () => {
        for (const name of episodes) {
            const client = await pool.connect();
            const epNr = getEpisodeNumber(name);

            try {
                const onSpotify = !missingEpsPerNow.includes(name);
                await client.query(`INSERT INTO all_eps VALUES(DEFAULT, $1, $2, $3)`, [
                    epNr,
                    name,
                    onSpotify,
                ]);
            } finally {
                client.release();
            }
        }
    })().catch((err) => console.log(err.message));

    console.log("inserts done");
});
