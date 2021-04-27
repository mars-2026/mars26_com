import { useState, useEffect } from "react";
import { loadModules } from "esri-loader";

export default function MarsGridLayer(props: { sceneView: any }) {
  const [layer, setLayer] = useState(null);

  useEffect(() => {
    if (props.sceneView) {
      loadModules(["esri/layers/TileLayer"])
        .then(([TileLayer]) => {
          const marsGridLayer = new TileLayer({
            url:
              "https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer?f=json",
          });

          setLayer(marsGridLayer);

          if (props.sceneView?.map) {
            props.sceneView.map.add(marsGridLayer);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [props.sceneView]);

  return null;
}
