import { Base64 } from "js-base64";
import React, { useState } from "react";

const Gmail = () => {
  const [emailList, setEmailList] = useState([]);
  const [user, setUser] = useState();
  const [message, setMessage] = useState();

  let tokenClient;
  var clientId = process.env.REACT_APP_CLIENT_ID;
  var email = user?.email;
  const santanaToken = localStorage.getItem("santanaToken");

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
    console.log(tokenClient, "tokenclient");
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
          Authorization: "Bearer " + santanaToken,
        },
      },
    )
      .then((response) => response.json())
      .then((content) => {
        console.log(content);
        setMessage(content);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    if (santanaToken !== "") {
      // https://www.googleapis.com/oauth2/v2/userinfo?access_token="YOUR_ACCESS_TOKEN"
      fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
        headers: {
          Authorization: "Bearer " + santanaToken,
        },
      })
        .then((response) => response.json())
        .then((content) => {
          // console.log(content);
          setUser(content);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [santanaToken]);

  const handleLogout = () => {
    localStorage.setItem("santanaToken", "");
  };

  const getHTMLPart = (arr) => {
    for (var x = 0; x <= arr.length; x++) {
      if (typeof arr[x].parts === "undefined") {
        if (arr[x].mimeType === "text/html") {
          return arr[x].body.data;
        }
      } else {
        return getHTMLPart(arr[x].parts);
      }
    }
    return "";
  };

  const getMessageBody = (message) => {
    const encodedBody =
      typeof message.parts === "undefined"
        ? message.body.data
        : getHTMLPart(message.parts);

    return Base64.decode(encodedBody);
  };

  const addToFrame = (message) => {
    console.log(document?.getElementById("iframe"), "iframe");
    let ifrm = document?.getElementById("iframe");
    ifrm.innerHTML = getMessageBody(message.payload);
  };

  React.useEffect(() => {
    if (message) {
      addToFrame(message);
    }
    // eslint-disable-next-line
  }, [message]);

  return (
    <div>
      <button onClick={getToken}>Get access token</button>
      <button onClick={getObject}>Load Object</button>
      <button onClick={getEmail}>Load Email</button>
      <button onClick={handleLogout}>Logout</button>
      <div as="iframe" id="iframe"></div>
    </div>
  );
};

export default Gmail;
