import axios from "axios";

// @ts-ignore
const apiPath = process.env.REACT_APP_SERVERLESS
  ? "/.netlify/functions/index"
  : "/api";

export function postRequestToken() {
  return axios({
    url: `${apiPath}/twitter/oauth/request-token`,
    method: "POST",
  });
}

export function postAccessToken(oauth_token: string, oauth_verifier: string) {
  return axios({
    url: `${apiPath}/twitter/oauth/access-token`,
    method: "POST",
    data: { oauth_token, oauth_verifier },
  });
}

export function getAuthenticatedAccount() {
  return axios({
    url: `${apiPath}/twitter/account`,
    method: "GET",
  });
}

export function postLogout() {
  return axios({
    url: `${apiPath}/twitter/logout`,
    method: "POST",
  });
}

export function postTweet(tweet: {
  image: string;
  message: string;
  latitude: number;
  longitude: number;
}) {
  return axios({
    url: `${apiPath}/tweet`,
    method: "POST",
    data: tweet,
  });
}

export function fetchTweets() {
  return axios({
    url: `${apiPath}/tweets`,
    method: "GET",
  });
}

export function getTweetOembed(tweetUrl: string) {
  return axios({
    url: `${apiPath}/tweet/oembed/${encodeURIComponent(
      tweetUrl.replace(/\/photo\/\d*$/, "")
    )}`,
    method: "GET",
  });
}
