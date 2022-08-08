"use strict";

const dotenv = require("dotenv");
dotenv.config({ path: "./config/env/config.env" }); // bunun yerini degistirme!!!
const app = require("./app");
const port = process.env.PORT;
//192.168.1.39
app.listen(port, "localhost", () => {
  console.log(`App running on port ${port}...`);
});
