import dotenv from "dotenv";

function getConfig() {
  if (!process.env.REACT_APP_SERVERLESS) {
    dotenv.config();
  }
  return {
    FRONTEND_URL: process.env.FRONTEND_URL || "",
    TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY || "",
    TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET || "",
    MONGODB_URI: process.env.MONGODB_URI || "",
    PORT: process.env.PORT || 8080,
  };
}

const config = getConfig();

export default config;
