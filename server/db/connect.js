const pg = require("pg");
pg.types.setTypeParser(1184, (str) => str);

// pg v8 reads the pool cap from the constructor's `max`; pg.defaults.poolSize is ignored
const pool = new pg.Pool({ max: 25 });

module.exports = pool;
