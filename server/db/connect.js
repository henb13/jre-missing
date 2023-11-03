const pg = require("pg");
pg.types.setTypeParser(1184, (str) => str);
pg.defaults.poolSize = 25;

const pool = new pg.Pool();

module.exports = pool;
