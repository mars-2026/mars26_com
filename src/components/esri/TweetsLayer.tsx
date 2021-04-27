import { useState, useEffect } from "react";
import { loadModules } from "esri-loader";

type Tweet = {
  tweetId: string;
  displayUrl: string;
  expandedUrl: string;
  latitude: number;
  longitude: number;
};

export default function TweetsLayer(props: {
  sceneView: any;
  tweets: Tweet[];
  onClickTweetGraphic: (tweetGraphic: any) => void;
}) {
  const [layer, setLayer] = useState<null | any>(null);
  const [eventHandler, setEventHandler] = useState<null | any>(null);

  useEffect(() => {
    if (props.sceneView && props.tweets.length > 0) {
      loadModules(["esri/layers/GraphicsLayer", "esri/Graphic"])
        .then(([GraphicsLayer, Graphic]) => {
          const graphicsLayer = new GraphicsLayer();

          props.tweets.forEach((tweet) => {
            const point = {
              type: "point",
              x: tweet.longitude, //lng,
              y: tweet.latitude, //lat,
              spatialReference: 104971,
            };

            const pointGraphic = new Graphic({
              geometry: point,
              symbol: {
                type: "picture-marker",
                url: "assets/twitter.svg",
                width: "30px",
                height: "30px",
              },
              attributes: {
                ...tweet,
              },
            });

            graphicsLayer.add(pointGraphic);
          });

          if (props.sceneView?.map) {
            setLayer(graphicsLayer);
            props.sceneView.map.add(graphicsLayer);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [props.sceneView, props.tweets]);

  useEffect(() => {
    if (layer) {
      const eventHandler = props.sceneView.on("click", async (event: any) => {
        if (!layer || !props.sceneView) {
          return;
        }

        const screenPoint = {
          x: event.x,
          y: event.y,
        };

        const hitTestResponse = await props.sceneView.hitTest(screenPoint);

        if (hitTestResponse.results.length) {
          const [firstResult = {}] =
            hitTestResponse.results.filter((result: any) => {
              return result.graphic.layer === layer;
            }) || [];

          if (
            firstResult.graphic &&
            firstResult.graphic.attributes &&
            firstResult.graphic.attributes.tweetId
          ) {
            props.onClickTweetGraphic(firstResult.graphic);
          }
        }
      });

      setEventHandler(eventHandler);
    }

    return () => {
      if (eventHandler) {
        eventHandler.remove();
      }
    };
  }, [layer]);

  return null;
}
