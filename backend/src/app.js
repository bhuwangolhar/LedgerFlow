const express = require("express");
const cors = require("cors");

require("./models");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

module.exports = app;
