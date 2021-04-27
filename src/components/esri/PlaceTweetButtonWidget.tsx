import React from "react";
import ReactDOM from "react-dom";
import { Twitter } from "react-feather";

export default function PlaceTweetButtonWidget(props: {
  onClickPlaceTweet: () => void;
  sceneView: any;
}) {
  React.useEffect(() => {
    if (props.sceneView) {
      const widgetNode = document.createElement("div");
      widgetNode.id = "placeTweetWidget";

      ReactDOM.render(
        <button
          className="addTweetButton special-font flex-row flex items-center tracking-widest hover:font-semibold focus:outline-none py-2 px-4 text-white"
          onClick={props.onClickPlaceTweet}
        >
          <Twitter size={16} className="addTweetSvg mr-2" /> Place a Tweet
        </button>,
        widgetNode
      );

      props.sceneView.ui.add(widgetNode, "bottom-right");
    }

    return () => {
      if (props.sceneView) {
        props.sceneView.ui.remove("placeTweetWidget");
      }
    };
  }, [props.sceneView, props.onClickPlaceTweet]);

  return null;
}
