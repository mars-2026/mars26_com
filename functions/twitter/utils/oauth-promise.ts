import { OAuth } from "oauth";

import config from "../../config";

const oauth = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  config.TWITTER_CONSUMER_KEY,
  config.TWITTER_CONSUMER_SECRET,
  "1.0",
  config.FRONTEND_URL,
  "HMAC-SHA1"
);

export const twitterOAuthPromise = {
  getOAuthRequestToken: () => {
    return new Promise<any>((resolve, reject) => {
      oauth.getOAuthRequestToken(
        (error, oauth_token, oauth_token_secret, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ oauth_token, oauth_token_secret, results });
          }
        }
      );
    });
  },

  getOAuthAccessToken: (
    oauth_token: string,
    oauth_token_secret: string,
    oauth_verifier: any
  ) => {
    return new Promise<any>((resolve, reject) => {
      oauth.getOAuthAccessToken(
        oauth_token,
        oauth_token_secret,
        oauth_verifier,
        (error, oauth_access_token, oauth_access_token_secret, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              oauth_access_token,
              oauth_access_token_secret,
              results,
            });
          }
        }
      );
    });
  },

  getProtectedResource: (
    url: string,
    oauth_access_token: string,
    oauth_access_token_secret: string
  ) => {
    return new Promise<any>((resolve, reject) => {
      oauth.get(
        url,
        oauth_access_token,
        oauth_access_token_secret,
        (error, data, response) => {
          if (error) {
            reject(error);
          } else {
            resolve({ data, response });
          }
        }
      );
    });
  },

  postProtectedResource: (
    url: string,
    oauth_token: string,
    oauth_token_secret: string,
    post_body: any,
    post_content_type: any,
    callback: any
  ) => {
    return new Promise<any>((resolve, reject) => {
      oauth.post(
        url,
        oauth_token,
        oauth_token_secret,
        post_body,
        post_content_type,
        callback
      );
    });
  },
};

export default twitterOAuthPromise;
