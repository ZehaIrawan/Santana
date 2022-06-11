import jwt_decode from "jwt-decode";
import React, { useState } from "react";

const Gmail = () => {
  const [emailList, setEmailList] = useState([]);
  const [user, setUser] = useState();

  var tokenClient;
  var clientId = process.env.REACT_APP_CLIENT_ID;
  var email = user?.email;

  const scopes = [
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  function initTokenClient() {
    /* global google */
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      prompt: "select_account",
      callback: (tokenResponse) => {
        console.log(tokenResponse, "tokenres");
        localStorage.setItem("santanaToken", tokenResponse.access_token);
        try {
          console.log(jwt_decode(tokenResponse.access_token), "blake");
        } catch (error) {
          console.log(`${error} ERR`);
        }
      },
      scope: scopes.join(" "),
    });
  }

  window.onGoogleLibraryLoad = () => {
    // console.log("loaded");
    initTokenClient();
    // console.log("init");
  };

  function getToken() {
    // Re-entrant function to request user consent.
    // Returns an access token to the callback specified in google.accounts.oauth2.initTokenClient
    // Use a user gesture to call this function and obtain a new, valid access token
    // when the previous token expires and a 401 status code is returned by Google API calls.
    tokenClient.requestAccessToken();
  }

  function getObject() {
    fetch(`https://gmail.googleapis.com/gmail/v1/users/${email}/messages`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("santanaToken"),
      },
    })
      .then((response) => response.json())
      .then((content) => {
        console.log(content);
        setEmailList(content.messages);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getEmail() {
    fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${emailList[0].id}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("santanaToken"),
        },
      },
    )
      .then((response) => response.json())
      .then((content) => {
        console.log(content);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    // https://www.googleapis.com/oauth2/v2/userinfo?access_token="YOUR_ACCESS_TOKEN"
    fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("santanaToken"),
      },
    })
      .then((response) => response.json())
      .then((content) => {
        console.log(content);
        setUser(content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <button onClick={getToken}>Get access token</button>
      <button onClick={getObject}>Load Object</button>
      <button onClick={getEmail}>Load Email</button>
    </div>
  );
};

export default Gmail;
