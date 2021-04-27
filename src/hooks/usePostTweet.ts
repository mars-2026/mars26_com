import React from "react";

import * as twitterApi from "../apis/twitter";

export default function usePostTweet() {
  const [postStatus, setPostStatus] = React.useState("idle");

  async function postTweet(tweetParams: {
    message: string;
    image: string;
    longitude: number;
    latitude: number;
  }) {
    try {
      setPostStatus("pending");

      const response = await twitterApi.postTweet(tweetParams);

      setPostStatus("success");

      return response.data;
    } catch (error) {
      console.error(error);
      setPostStatus("fail");
    }
  }

  return { postTweet, postStatus };
}
