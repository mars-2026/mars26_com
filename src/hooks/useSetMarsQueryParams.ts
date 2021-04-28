import React from "react";
import queryString from "query-string";

const relevantSceneEvents = ["drag", "mouse-wheel"];

export default function useSetMarsQueryParams(sceneView: any) {
  const [eventHandlers, setEventHandlers] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (sceneView) {
      const eventHandlers = relevantSceneEvents.map((event) => {
        return sceneView.on(event, () => setMarsQueryParams(sceneView));
      });

      setEventHandlers(eventHandlers);
    }

    return () => {
      eventHandlers.forEach((eventHandler) => {
        eventHandler.remove();
      });
    };
  }, [sceneView]);
}

function setMarsQueryParams(sceneView: any) {
  const marsUrlParams = getMarsQueryParams(sceneView);
  window.history.replaceState(marsUrlParams, document.title, '#' + queryString.stringify(marsUrlParams));
}

function getMarsQueryParams(sceneView: any) {
  const { center, camera, zoom } = sceneView;
  const { longitude, latitude } = center;
  const { heading, tilt } = camera;

  return {
    longitude,
    latitude,
    zoom,
    heading,
    tilt,
  };
}
