const mysql = require("mysql2/promise");

const is_render = process.env.IS_RENDER || false;

const dbConfigRender = {
  host: "sql.freedb.tech",
  user: "freedb_2350_main.",
  password: "&c!gQXSFgVweD*4",
  database: "freedb_COMP2350_A01342823",
  multipleStatements: false,
  namedPlaceholders: true,
};

const dbConfigLocal = {
  host: "localhost",
  user: "root",
  password: "abc123!",
  database: "freedb_comp2350_a01342823",
  multipleStatements: false,
  namedPlaceholders: true,
};
if (is_render) {
  var database = mysql.createPool(dbConfigQoddi);
} else {
  var database = mysql.createPool(dbConfigLocal);
}

module.exports = database;
