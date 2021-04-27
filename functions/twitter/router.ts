import express from "express";

import oauth from "./utils/oauth-promise";
import twitterApi from "./twitter-api";
import db from "./db";

const COOKIE_NAME = "twitter-oauth-token";

const router = express.Router();

//OAuth Step 1
router.post("/twitter/oauth/request-token", async (req, res) => {
  try {
    const {
      oauth_token,
      oauth_token_secret,
    } = await oauth.getOAuthRequestToken();

    res.cookie(COOKIE_NAME, oauth_token, {
      maxAge: 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      sameSite: true,
    });

    await db.upsertTokens(oauth_token, { oauth_token_secret });

    res.json({ oauth_token });
  } catch (error) {
    console.error("POST /twitter/oauth/request-token", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

//OAuth Step 3
router.post("/twitter/oauth/access-token", async (req, res) => {
  try {
    const { oauth_token: req_oauth_token, oauth_verifier } = req.body;
    const oauth_token = req.cookies[COOKIE_NAME];
    const { oauth_token_secret } = await db.getTokens(oauth_token);

    if (oauth_token !== req_oauth_token) {
      res.status(403).json({ message: "Request tokens do not match" });
      return;
    }

    const {
      oauth_access_token,
      oauth_access_token_secret,
    } = await oauth.getOAuthAccessToken(
      oauth_token,
      oauth_token_secret,
      oauth_verifier
    );

    await db.upsertTokens(oauth_token, {
      oauth_access_token,
      oauth_access_token_secret,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("POST /twitter/oauth/access-token", error);
    res.status(403).json({ message: "Missing access token" });
  }
});

router.post("/tweet", async (req, res) => {
  try {
    const { image, message, longitude, latitude } = req.body;

    if (
      typeof image !== "string" ||
      typeof message !== "string" ||
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      res.status(403).json({ message: "Invalid POST /tweet body" });
      return;
    }

    const oauth_token = req.cookies[COOKIE_NAME];
    const {
      oauth_access_token,
      oauth_access_token_secret,
    } = await db.getTokens(oauth_token);

    const twit = twitterApi.createTwit(
      oauth_access_token,
      oauth_access_token_secret
    );

    const b64Content = image.replace("data:image/png;base64,", "");

    const uploadedMedia = await twitterApi.uploadMedia(twit, b64Content);

    await twitterApi.createMediaMetadata(twit, {
      mediaId: uploadedMedia.media_id_string,
      altText: { text: message },
    });

    const postedTweet = await twitterApi.postStatusUpdate(twit, {
      message,
      mediaIds: [uploadedMedia.media_id_string],
    });

    const tweetToStoreInDB = {
      tweetId: postedTweet.id,
      displayUrl: postedTweet.entities.media[0].display_url,
      expandedUrl: postedTweet.entities.media[0].expanded_url,
      latitude,
      longitude,
    };

    await db.insertTweet(tweetToStoreInDB as any);

    res.json(tweetToStoreInDB);
  } catch (error) {
    console.error("POST /tweet", error);
    res.status(403).json({ message: "Missing, invalid, or expired tokens" });
  }
});

router.get("/tweets", async (req, res) => {
  try {
    const { query = {} } = req;

    const tweets = await db.getTweets(query);

    res.json(tweets);
  } catch (error) {
    console.error("GET /tweets", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/twitter/logout", async (req, res) => {
  try {
    const oauth_token = req.cookies[COOKIE_NAME];
    await db.deleteTokens(oauth_token);

    res.cookie(COOKIE_NAME, {}, { maxAge: -1 });
    res.json({ success: true });
  } catch (error) {
    console.error("POST /twitter/logout", error);
    res.status(403).json({ message: "Missing, invalid, or expired tokens" });
  }
});

router.get("/twitter/account", async (req, res) => {
  try {
    const oauth_token = req.cookies[COOKIE_NAME];
    const {
      oauth_access_token,
      oauth_access_token_secret,
    } = await db.getTokens(oauth_token);

    const twit = twitterApi.createTwit(
      oauth_access_token,
      oauth_access_token_secret
    );

    const account = await twitterApi.getAccountVerifyCredentials(twit);
    res.json(account);
  } catch (error) {
    console.error("GET /twitter/account", error);
    res.status(403).json({ message: "Missing, invalid, or expired tokens" });
  }
});

router.get("/tweet/oembed/:tweetUrl", async (req, res) => {
  try {
    const oembedResponse = await twitterApi.getTweetOembed(req.params.tweetUrl);
    res.json(oembedResponse.data);
  } catch (error) {
    console.error("GET /twitter/oembed/:tweetUrl", error);
    res.status(500);
  }
});

export default router;
