const { mapMissingEpisodes, mapShortenedEpisodes } = require("./mapQueries");

const getEpisodeNumber = require("../lib/getEpisodeNumber");

const DB = (client) => {
  return {
    getAllEpisodes: async function () {
      const { rows } = await client.query("SELECT * from all_eps");
      return rows;
    },
    getMissingEpisodes: async function () {
      const { rows } = await client.query(
        `SELECT full_name, EXTRACT(EPOCH FROM date_removed at time zone 'UTC') * 1000 AS date_removed, episode_number 
        FROM all_eps  
        LEFT JOIN (
          SELECT id, MAX(date_removed) AS date_removed
          from date_removed 
          group by id
        ) AS t2
        ON all_eps.id = t2.id 
        WHERE on_spotify = false
        ORDER BY episode_number DESC NULLS LAST, all_eps.id`
      );
      return mapMissingEpisodes(rows);
    },
    getShortenedEpisodes: async function () {
      const { rows } = await client.query(
        `SELECT all_eps.id AS id, episode_number, full_name, EXTRACT(EPOCH FROM date_changed at time zone 'UTC') * 1000 AS date_changed, new_duration, old_duration
        FROM all_eps
        JOIN (
          SELECT id, episode_id, new_duration, old_duration, date AS date_changed
          FROM duration_changes
          GROUP BY episode_id, id, old_duration
         ) AS t2
         ON all_eps.id = t2.episode_id
         ORDER BY date_changed DESC`
      );
      return mapShortenedEpisodes(rows);
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
        `SELECT last_checked, EXTRACT(EPOCH FROM last_checked at time zone 'UTC') * 1000 AS miliseconds 
        FROM all_eps_log`
      );
      return {
        miliseconds: parseInt(rows[0]?.miliseconds),
      };
    },
  };
};

module.exports = DB;
