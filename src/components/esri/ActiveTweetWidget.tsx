import React from "react";
import ReactDOM from "react-dom";

import Tweet from "../Tweet";

import * as twitterApi from "../../apis/twitter";

export default function ActiveTweetWidget(props: {
  activeTweetUrl: any;
  sceneView: any;
  onClickOutsideWidget: () => any;
}) {
  React.useEffect(() => {
    if (props.sceneView && props.activeTweetUrl) {
      const widgetNode = document.createElement("div");
      widgetNode.id = "activeTweet";
      widgetNode.className = "pt-16";

      twitterApi
        .getTweetOembed(props.activeTweetUrl)
        .then((result) => {
          if (result.data && result.data.html) {
            ReactDOM.render(
              <Tweet
                blockquoteHtml={result.data.html}
                // onClickOutside={() => props.sceneView.ui.remove("activeTweet")}
                onClickOutside={props.onClickOutsideWidget}
              />,
              widgetNode
            );

            props.sceneView.ui.add(widgetNode, "top-right");
          }
        })
        .catch((error) => console.error(error));
    }

    return () => {
      if (props.sceneView) {
        props.sceneView.ui.remove("activeTweet");
      }
    };
  }, [props.sceneView, props.activeTweetUrl]);

  return null;
}
