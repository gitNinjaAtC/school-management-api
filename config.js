const fs = require("fs");
module.exports = {
  dbConfig: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
      ca: fs.readFileSync("./certs/ca.pem"),
    },
  },
};
