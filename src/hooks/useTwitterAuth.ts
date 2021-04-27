import React from "react";
import queryString from "query-string";
import { useHistory } from "react-router-dom";

import {
  postAccessToken,
  postRequestToken,
  getAuthenticatedAccount,
  postLogout,
} from "../apis/twitter";

export default function useTwitterAuth() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loggedInAccount, setLoggedInAccount] = React.useState<null | {
    name: string;
    screen_name: string;
    profile_image_url: string;
  }>(null);
  const history = useHistory();

  async function login() {
    try {
      localStorage.setItem("queryParams", window.location.hash);

      //OAuth Step 1
      const response = await postRequestToken();

      const { oauth_token } = response.data;
      //Oauth Step 2
      window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
    } catch (error) {
      console.error(error);
    }
  }

  async function logout() {
    try {
      await postLogout();
      setIsLoggedIn(false);
      setLoggedInAccount(null);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    async function handleAuthStatus() {
      const {
        oauth_token,
        oauth_verifier,
      }: {
        oauth_token?: string;
        oauth_verifier?: string;
      } = queryString.parse(window.location.search);

      if (oauth_token && oauth_verifier) {
        try {
          const hash = localStorage.getItem("queryParams");
          history.push(`/${hash}`);

          //Oauth Step 3
          await postAccessToken(oauth_token, oauth_verifier);
          setIsLoggedIn(true);
        } catch (error) {
          console.error(error);
        }
      }
    }

    handleAuthStatus();
  }, []);

  React.useEffect(() => {
    async function getLoggedInAccount() {
      try {
        if (isLoggedIn) {
          const response = await getAuthenticatedAccount();
          setLoggedInAccount(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getLoggedInAccount();
  }, [isLoggedIn]);

  return { login, logout, isLoggedIn, loggedInAccount, setIsLoggedIn };
}
