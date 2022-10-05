const getEpisodeNumber = require("../lib/getEpisodeNumber");

const DB = (client) => {
  return {
    getAllEpisodes: async function () {
      const { rows } = await client.query("SELECT * from all_eps");
      return rows;
    },
    getMissingEpisodes: async function () {
      const { rows } = await client.query(
        `SELECT full_name, date_removed, episode_number 
                 FROM all_eps  
                 LEFT JOIN (
                  SELECT id, MAX(date_removed) as date_removed
                  from date_removed 
                  group by id
                 ) as t2
                 ON all_eps.id = t2.id 
                 WHERE on_spotify = false 
                 ORDER BY episode_number desc, all_eps.id`
      );
      return rows.sort((a, b) => b.episode_number - a.episode_number);
    },
    getShortenedEpisodes: async function () {
      const { rows } = await client.query(
        `SELECT episode_number, full_name, date_changed, duration as currentDuration, old_duration 
                 FROM all_eps  
                 LEFT JOIN (
                  SELECT id, MAX(date) as date_changed
                  from duration_changes 
                  group by id
                 ) as t2
                 ON all_eps.id = t2.id 
                 ORDER BY episode_number desc, all_eps.id`
      );
      return rows;
    },
    insertNewEpisode: async function (episode) {
      const epNumber = getEpisodeNumber(episode.name);
      await client.query("INSERT INTO all_eps VALUES(DEFAULT, $1, $2, $3, $4)", [
        epNumber,
        episode.name,
        true,
        episode.duration,
      ]);
    },
    updateEpisodeName: async function (name, id) {
      await client.query("UPDATE all_eps SET full_name=($1) WHERE id=($2)", [name, id]);
    },
    updateEpisodeDuration: async function (newDuration, id) {
      await client.query("UPDATE all_eps SET duration=($1) WHERE id=($2)", [newDuration, id]);
    },
    setSpotifyStatus: async function ({ id }, bool) {
      await client.query(`UPDATE all_eps SET on_spotify=($1) WHERE id=($2)`, [bool, id]);
    },
    setLastCheckedNow: async function () {
      await client.query("UPDATE all_eps_log SET last_checked=now()");
    },
    getLastChecked: async function () {
      const { rows } = await client.query(
        "SELECT last_checked, EXTRACT(EPOCH FROM last_checked at time zone 'UTC') AS miliseconds from all_eps_log"
      );
      return {
        last_checked: rows[0]?.last_checked,
        miliseconds: rows[0]?.miliseconds * 1000,
      };
    },
    getEpisodesWithSameEpNumber: async function () {
      const { rows } = await client.query(
        `SELECT *
        FROM all_eps A
        JOIN (
          SELECT COUNT(*) as Count, B.episode_number
          FROM all_eps B
          GROUP BY B.episode_number
        ) AS B ON A.episode_number = B.episode_number
        WHERE B.Count > 1
        ORDER by A.episode_number;`
      );
      return rows;
    },
  };
};

module.exports = DB;
