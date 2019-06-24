const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api");
const {
  routeNotFound,
  handle500,
  handleCustomErrors,
  handlePsqlErrors
} = require("./errors");

app.use(cors());

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handle500);

module.exports = app;
