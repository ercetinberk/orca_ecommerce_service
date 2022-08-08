const sql = require("mssql");

const dbConnectionString = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
var dbConfig = {
  user: "Orca_orca",
  password: "Orcasupport22!",
  server: "mssql7.websitelive.net",
  database: "6302_Orca_E_Commerce",
  "options": {
    "encrypt": true,
    "enableArithAbort": true,
    "trustServerCertificate": true
}
};
exports.runQuery = function (query) {
  return sql.connect(dbConfig).then((pool) => {
    return pool.query(query);
  });
};

