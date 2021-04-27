import React from "react";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router";

export default function useGoToOnMount(
  marsSceneView: any,
  isLoggedIn: boolean,
  onGoToSuccessAfterAuth: () => void
) {
  const location = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    if (marsSceneView) {
      const didRefreshAfterAuth =
        isLoggedIn && Boolean(localStorage.getItem("queryParams"));
      const queryParamsSet = Boolean(location.search);
      const hashParamsSet = Boolean(location.hash);

      if (didRefreshAfterAuth || queryParamsSet || hashParamsSet) {
        const queryParams = didRefreshAfterAuth
          ? localStorage.getItem("queryParams")
          : queryParamsSet
          ? location.search
          : hashParamsSet
          ? location.hash
          : "";

        const parsedQueryParams = queryString.parse(queryParams || "", {
          parseNumbers: true,
        });

        if (Object.keys(parsedQueryParams).length > 0) {
          setTimeout(() => {
            marsSceneView
              .goTo({
                center: [
                  parsedQueryParams.longitude,
                  parsedQueryParams.latitude,
                ],
                heading: parsedQueryParams.heading,
                zoom: parsedQueryParams.zoom,
                tilt: parsedQueryParams.tilt,
              })
              .then(() => {
                if (didRefreshAfterAuth) {
                  onGoToSuccessAfterAuth();
                  localStorage.removeItem("marsUrlParams");
                } else {
                  history.push(`#${queryString.stringify(parsedQueryParams)}`);
                }
              })
              .catch((error: Error) => {
                console.error(error);
              });
          }, 500);
        }
      }
    }
  }, [isLoggedIn, marsSceneView]);
}
