import React from "react";

import * as twitterApi from "../apis/twitter";

export default function useFetchTweets() {
  const [fetchStatus, setFetchStatus] = React.useState("idle");
  const [fetchedTweets, setFetchedTweets] = React.useState([]);

  async function fetchTweets() {
    try {
      setFetchStatus("pending");
      const response = await twitterApi.fetchTweets();
      setFetchStatus("success");
      setFetchedTweets(response.data);
    } catch (error) {
      console.error(error);
      setFetchStatus("fail");
    }
  }

  React.useEffect(() => {
    fetchTweets();
  }, []);

  return { fetchStatus, fetchedTweets, fetchTweets };
}
