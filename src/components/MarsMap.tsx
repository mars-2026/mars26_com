import React from "react";
import { toast } from "react-toastify";

import MarsSceneView from "./esri/MarsSceneView";
import PlaceTweet from "./PlaceTweet";
import ToastWithLink from "./ToastWithLink";

import useTwitterAuth from "../hooks/useTwitterAuth";
import usePostTweet from "../hooks/usePostTweet";
import useFetchTweets from "../hooks/useFetchTweets";
import useSetMarsQueryParams from "../hooks/useSetMarsQueryParams";
import useGoToOnMount from "../hooks/useGoToOnMount";

export default function MarsMap() {
  const {
    login,
    logout,
    isLoggedIn,
    loggedInAccount,
    setIsLoggedIn,
  } = useTwitterAuth();
  const { postTweet, postStatus } = usePostTweet();
  const { fetchedTweets, fetchTweets } = useFetchTweets();

  const [marsSceneView, setMarsSceneView] = React.useState<null | any>(null);
  const [showPlaceTweet, setShowPlaceTweet] = React.useState(false);
  const [screenshotDataUrl, setScreenshotDataUrl] = React.useState("");
  const [activeTweetGraphic, setActiveTweet] = React.useState<null | any>(null);

  useSetMarsQueryParams(marsSceneView);

  useGoToOnMount(marsSceneView, isLoggedIn, () => handleClickPlaceTweet());

  const handleClickPlaceTweet = async () => {
    try {
      if (showPlaceTweet) {
        setShowPlaceTweet(false);
      } else if (!isLoggedIn) {
        await login();
      } else {
        const { dataUrl } = await marsSceneView.takeScreenshot({
          width: 350,
        });
        setScreenshotDataUrl(dataUrl);
        setShowPlaceTweet(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleClickPostTweet = async (message: string) => {
    try {
      const [hrefWithoutHash, urlParams] = window.location.href.split("#");
      const messageWithLink = `${message}\n${`${hrefWithoutHash}?${urlParams}`}`;

      if (messageWithLink.length > 280) {
        throw new Error("Status message too long");
      }

      const postedTweet = await postTweet({
        message: messageWithLink,
        image: screenshotDataUrl,
        longitude: marsSceneView.center.longitude,
        latitude: marsSceneView.center.latitude,
      });
      toast.success(
        <ToastWithLink
          message="Tweet successfully posted 🥳"
          link={"https://" + postedTweet.displayUrl}
        />
      );
      await fetchTweets();
      setShowPlaceTweet(false);
    } catch (error) {
      setIsLoggedIn(false);
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleClickLogout = async () => {
    try {
      await logout();
      setShowPlaceTweet(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleClickTweetGraphic = (tweetGraphic: any) => {
    tweetGraphic.symbol = {
      type: "picture-marker",
      url: "assets/twitter-white.svg",
      width: "30px",
      height: "30px",
    };
    setActiveTweet(tweetGraphic);

    if (marsSceneView) {
      marsSceneView.goTo({
        center: [
          tweetGraphic.attributes.longitude,
          tweetGraphic.attributes.latitude,
        ],
      });
    }
  };

  const handleClickOutsideActiveTweetWidget = () => {
    if (marsSceneView) {
      marsSceneView.ui.remove("activeTweet");
    }

    if (activeTweetGraphic) {
      activeTweetGraphic.symbol = {
        type: "picture-marker",
        url: "assets/twitter.svg",
        width: "30px",
        height: "30px",
      };
    }
    setActiveTweet(null);
  };

  return (
    <div className="h-full relative">
      <MarsSceneView
        onSetMarsSceneView={setMarsSceneView}
        tweets={fetchedTweets}
        onClickPlaceTweet={handleClickPlaceTweet}
        activeTweetGraphic={activeTweetGraphic}
        onClickTweetGraphic={handleClickTweetGraphic}
        onClickOutsideActiveTweetWidget={handleClickOutsideActiveTweetWidget}
      />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white">
      Thanks to the NASA, Ames Research Center, Caltech’s Murray Lab, USGS Astrogeology Science Center, DLR, Goddard Space Flight Center, University of Arizona, Malin Space Science Systems, Jet Propulsion Laboratory, PDS
      </div>
      {showPlaceTweet && (
        <PlaceTweet
          accountScreenName={
            loggedInAccount !== null ? loggedInAccount.screen_name : ""
          }
          screenshotDataUrl={screenshotDataUrl}
          onClickPostTweet={handleClickPostTweet}
          onClickLogout={handleClickLogout}
          postStatus={postStatus}
          onClickOutside={() => setShowPlaceTweet(false)}
        />
      )}
    </div>
  );
}
