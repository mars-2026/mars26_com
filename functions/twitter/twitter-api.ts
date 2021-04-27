import Twit from "twit";
import axios from "axios";

import config from "../config";

export function createTwit(
  oauthAccessToken: string,
  oauthAccessTokenSecret: string
) {
  return new Twit({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token: oauthAccessToken,
    access_token_secret: oauthAccessTokenSecret,
  });
}

export async function uploadMedia(
  twit: Twit,
  mediaData: string | Buffer | undefined
) {
  return new Promise<{
    media_id_string: string;
  }>((resolve, reject) => {
    twit.post("media/upload", { media_data: mediaData }, (error, data: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

export async function createMediaMetadata(
  twit: Twit,
  metadataParams: { mediaId: string; altText: { text: string } }
) {
  return new Promise<any>((resolve, reject) => {
    twit.post(
      "media/metadata/create",
      {
        media_id: metadataParams.mediaId,
        alt_text: metadataParams.altText,
      },
      (error, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
}

export async function postStatusUpdate(
  twit: Twit,
  statusParams: { message: string; mediaIds: string[] }
) {
  return new Promise<{
    id: string;
    entities: any;
  }>((resolve, reject) => {
    twit.post(
      "statuses/update",
      {
        status: statusParams.message,
        media_ids: statusParams.mediaIds,
      },
      (error, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
}

export async function getAccountVerifyCredentials(twit: Twit) {
  return new Promise<{
    name: string;
    screen_name: string;
    profile_image_url: string;
  }>((resolve, reject) => {
    twit.get("account/verify_credentials", (error, data: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

export async function getTweetOembed(tweetUrl: string) {
  return axios.get(
    `https://publish.twitter.com/oembed?url=${encodeURIComponent(
      tweetUrl
    )}&theme=dark&dnt=true&width=325`
  );
}

const api = {
  createTwit,
  createMediaMetadata,
  postStatusUpdate,
  uploadMedia,
  getAccountVerifyCredentials,
  getTweetOembed,
};

export default api;
