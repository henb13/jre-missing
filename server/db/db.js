const getEpisodeNumber = require("../lib/getEpisodeNumber");

const TABLE = process.env.NOdE_ENV === "development" ? "test_table" : "all_eps";

const DB = (client) => {
  return {
    getAllEpisodes: async function () {
      const { rows } = await client.query("SELECT * from all_eps");
      return rows;
    },
    getMissingEpisodes: async function () {
      const { rows } = await client.query(
        `SELECT full_name, date_removed, episode_number 
                 FROM ${TABLE}  
                 LEFT JOIN (
                 SELECT id, MAX(date_removed) as date_removed
                 from date_removed 
                 group by id
                 ) as t2
                 ON ${TABLE}.id = t2.id 
                 WHERE on_spotify = false 
                 ORDER BY episode_number desc, ${TABLE}.id`
      );
      return rows.sort((a, b) => b.episode_number - a.episode_number);
    },

    insertNewEpisode: async function (episodeName) {
      const epNumber = getEpisodeNumber(episodeName);
      await client.query("INSERT INTO ${TABLE} VALUES(DEFAULT, $1, $2, $3)", [
        epNumber,
        episodeName,
        true,
      ]);
    },

    updateEpisodeName: async function (value, id) {
      await client.query("UPDATE ${TABLE} SET full_name=($1) WHERE id=($2)", [value, id]);
    },

    setSpotifyStatus: async function ({ id }, bool) {
      await client.query(`UPDATE ${TABLE} SET on_spotify=($1) WHERE id=($2)`, [bool, id]);
    },

    setLastCheckedNow: async function () {
      await client.query("UPDATE ${TABLE}_log SET last_checked=now()");
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
                 FROM ${TABLE} A
                 JOIN (
                 SELECT COUNT(*) as Count, B.episode_number
                 FROM ${TABLE} B
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
