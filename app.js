const express = require("express");
const cors = require("cors");
const routers=require("./routers/index")
const customErrorHandler = require("./middlewares/error/customErrorHandler")

/////////////////////
// MIDDLEWARE START
/////////////////////

const app = express();
app.use(cors());

//Express body-middleware
app.use(express.json());

//Routes
app.use("/api", routers);
//app.use("/test/", testRoute);
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});

//Error Handler
app.use(customErrorHandler)

/////////////////////
// MIDDLEWARE END
/////////////////////

module.exports = app;
