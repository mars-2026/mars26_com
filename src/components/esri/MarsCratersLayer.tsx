import { useState, useEffect } from "react";
import { loadModules } from "esri-loader";

export default function MarsCratersLayer(props: { sceneView: any }) {
  const [, setLayer] = useState(null);

  useEffect(() => {
    if (props.sceneView) {
      loadModules(["esri/layers/FeatureLayer"])
        .then(([FeatureLayer]) => {
          const cratersLayer = new FeatureLayer({
            //url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/Mars_Nomenclature_Mountains/FeatureServer",
            url:
              "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/Mars_Nomenclature_Craters/FeatureServer",
            definitionExpression: "type = 'Crater, craters'",
            title: "Craters",
            visible: false,
            renderer: {
              type: "simple",
              symbol: {
                type: "polygon-3d",
                symbolLayers: [
                  {
                    type: "fill",
                    material: { color: [255, 255, 255, 0.1] },
                    outline: {
                      color: [0, 0, 0, 0.4],
                      size: 2,
                    },
                  },
                ],
              },
            },
            labelingInfo: [
              {
                labelPlacement: "above-center",
                labelExpressionInfo: { expression: "$feature.NAME" },
                symbol: {
                  type: "label-3d",
                  symbolLayers: [
                    {
                      type: "text",
                      material: {
                        color: [0, 0, 0, 0.9],
                      },
                      halo: {
                        size: 2,
                        color: [255, 255, 255, 0.7],
                      },
                      font: {
                        size: 10,
                      },
                    },
                  ],
                  verticalOffset: {
                    screenLength: 40,
                    maxWorldLength: 500000,
                    minWorldLength: 0,
                  },
                  callout: {
                    type: "line",
                    size: 0.5,
                    color: [255, 255, 255, 0.9],
                    border: {
                      color: [0, 0, 0, 0.3],
                    },
                  },
                },
              },
            ],
          });

          setLayer(cratersLayer);

          if (props.sceneView?.map) {
            props.sceneView.map.add(cratersLayer);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [props.sceneView]);

  return null;
}
