import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

import twitterRouter from "./twitter/router";

import config from "./config";

const app = express();

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(cookieParser());

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.json({ message: "Hello, mars!" });
});

if (process.env.REACT_APP_SERVERLESS) {
  //as per Netlify lambda conventions
  app.use("/.netlify/functions/index", rootRouter, twitterRouter);
  module.exports = app;
  module.exports.handler = serverless(app);
} else {
  app.use("/api", rootRouter, twitterRouter);
  app.listen(config.PORT, () => {
    console.log(`App listening at http://localhost:${config.PORT}`);
  });
}
