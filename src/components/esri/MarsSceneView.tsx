import { useState, useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

import MarsCratersLayer from "./MarsCratersLayer";
// import MarsGridLayer from "./MarsGridLayer";
import TweetsLayer from "./TweetsLayer";
import PlaceTweetButtonWidget from "./PlaceTweetButtonWidget";
import ActiveTweetWidget from "./ActiveTweetWidget";

type Props = {
  onSetMarsSceneView: (marsSceneView: any) => void;
  onClickPlaceTweet: () => void;
  onClickTweetGraphic: (tweetGraphic: any) => void;
  onClickOutsideActiveTweetWidget: () => void;
  tweets: {
    tweetId: string;
    displayUrl: string;
    expandedUrl: string;
    latitude: number;
    longitude: number;
  }[];
  activeTweetGraphic: any;
};

export default function MarsSceneView(props: Props) {
  const sceneViewRef = useRef(null);
  const [sceneView, setSceneView] = useState(null);

  useEffect(() => {
    loadModules([
      "esri/config",
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/WMTSLayer",
      "esri/layers/ElevationLayer",
    ])
      .then(([esriConfig, Map, SceneView, WMTSLayer, ElevationLayer]) => {
        esriConfig.request.httpsDomains = ["geoserver.mars26.com"];

        // const marsElevation = new ElevationLayer({
        //   url:
        //     "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer",
        //   copyright:
        //     "NASA, ESA, HRSC, Goddard Space Flight Center, USGS Astrogeology Science Center, Esri",
        // });

        const marsImagery = new WMTSLayer({
          url: "https://geoserver.mars26.com/geoserver/gwc/service/wmts",
          copyright:
            "<a target='_top' href='https://earthdata.nasa.gov'>Earthdata</a> by <a target='_top' href='https://www.nasa.gov'>NASA</a>",
          activeLayer: {
            id: "marsmaptiles:marsmaptiles",
          },
          serviceMode: "KVP",
        });

        const marsSceneView = new SceneView({
          tilingSchemeLocked: true,
          map: new Map({
            ground: {
              // layers: [marsElevation],
            },
            layers: [marsImagery],
          }),
          container: sceneViewRef.current,
          qualityProfile: "high",
          // setting the spatial reference for Mars_2000 coordinate system
          spatialReference: {
            wkid: 104971,
          },
          camera: {
            position: {
              x: -112,
              y: -25,
              z: 1000000,
              spatialReference: 104971,
            },
            heading: 29,
            tilt: 49,
          },
        });

        marsSceneView.ui.move("zoom", "bottom-left");
        marsSceneView.ui.move("navigation-toggle", "bottom-left");
        marsSceneView.ui.move("compass", "bottom-left");
        marsSceneView.ui.remove("attribution");

        setSceneView(marsSceneView);
        props.onSetMarsSceneView(marsSceneView);
      })
      .catch((error) => {
        console.error("Error while constructing MarsSceneView:", error);
      });

    return () => {
      if (sceneView) {
        (sceneView as any).destroy();
        props.onSetMarsSceneView(null);
      }
    };
  }, []);

  return (
    <div className="h-full pt relative">
      <div ref={sceneViewRef} className="h-full" />
      <MarsCratersLayer sceneView={sceneView} />
      {/* <MarsGridLayer sceneView={sceneView} /> */}
      <TweetsLayer
        sceneView={sceneView}
        tweets={props.tweets}
        onClickTweetGraphic={props.onClickTweetGraphic}
      />
      <PlaceTweetButtonWidget
        sceneView={sceneView}
        onClickPlaceTweet={props.onClickPlaceTweet}
      />
      <ActiveTweetWidget
        activeTweetUrl={
          props.activeTweetGraphic
            ? props.activeTweetGraphic.attributes.expandedUrl
            : ""
        }
        sceneView={sceneView}
        onClickOutsideWidget={props.onClickOutsideActiveTweetWidget}
      />
    </div>
  );
}
