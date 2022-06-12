import { Base64 } from "js-base64";
import React, { useEffect, useState } from "react";

const Gmail = () => {
  const [emailList, setEmailList] = useState([]);
  const [user, setUser] = useState();
  const [message, setMessage] = useState();

  const [emailData, setEmailData] = useState([]);

  let tokenClient;
  var clientId = process.env.REACT_APP_CLIENT_ID;
  var email = user?.emailAddress;
  const santanaToken = localStorage.getItem("santanaToken");

  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    // "https://www.googleapis.com/auth/userinfo.email",
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
    // mandiri Label_4280134530840289324
    // grab Label_8079547559545692198
    fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${email}/messages?labelIds=Label_8079547559545692198`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("santanaToken"),
        },
      },
    )
      .then((response) => response.json())
      .then((content) => {
        setEmailList(content.messages);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getEmail(email_id) {
    fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${email_id}`,
      {
        headers: {
          Authorization: "Bearer " + santanaToken,
        },
      },
    )
      .then((response) => response.json())
      .then((content) => {
        // console.log(content);
        // setMessage(content);
        // emailData.push(content);
        setEmailData(content);
        // setEmailData((prev) => [...prev, getEmail(content.id)]);
        // return content;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (santanaToken !== "") {
      fetch(`https://gmail.googleapis.com/gmail/v1/users/me/profile`, {
        headers: {
          Authorization: "Bearer " + santanaToken,
        },
      })
        .then((response) => response.json())
        .then((content) => {
          setUser(content);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [santanaToken]);

  // Get labels
  // useEffect(() => {
  //   if (santanaToken !== "") {
  //     fetch(`https://gmail.googleapis.com/gmail/v1/users/${email}/labels`, {
  //       headers: {
  //         Authorization: "Bearer " + santanaToken,
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((content) => {
  //         console.log(content, "label");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [email, santanaToken]);

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
    let ifrm = document?.getElementById("iframe");
    ifrm.innerHTML = getMessageBody(message.payload);
  };

  useEffect(() => {
    emailList.forEach((email) => {
      getEmail(email.id);
    });
  }, [emailList]);

  if (emailData.payload) {
    const emailHTML = getMessageBody(emailData?.payload);
    const { body } = new DOMParser().parseFromString(emailHTML, "text/html");
    const value = body.querySelector("td").innerText;
    console.log(value);
    const total = value
      .match(/(?<=Rp\s+).*?(?=\s+WAKTU)/gs)[0]
      .split("TANGGAL")[0];
    const date = value.match(/(?<=WAKTU\s+).*?(?=\s+\+0800Detail)/gs)[0];
    const restaurant = value.match(/(?<=Dari:\s+).*?(?=\s+- )/gs)[0];
    console.log(date, restaurant, total);
  }

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
