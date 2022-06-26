import { Base64 } from "js-base64";
import { useEffect, useState } from "react";
import TransactionItem from "./TransactionItem";

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

  async function getObject() {
    // mandiri Label_4280134530840289324
    // grab Label_8079547559545692198
    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${email}/messages?labelIds=Label_8079547559545692198`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("santanaToken"),
        },
      },
    );
    const res2 = await res.json();
    return res2.messages;
    // .then((response) => response.json())
    // .then((content) => {
    //   return content.messages;
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
  }

  async function getEmail(email_id) {
    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${email_id}`,
      {
        headers: {
          Authorization: "Bearer " + santanaToken,
        },
      },
    );
    const res2 = res.json();
    return res2;
  }

  console.log(emailData, "emailDATA");

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

  const [loading, setLoading] = useState(false);

  async function fetchMyAPI() {
    setLoading(true);
    const ids = await getObject();

    const res = await Promise.all(
      ids?.map(async (email) => {
        const res3 = await getEmail(email.id);
        return res3;
      }),
    );
    setEmailData(res);
    setLoading(false);
  }

  useEffect(() => {
    if (user) {
      fetchMyAPI();
    }
  }, [user]);

  const formatCurrency = (value) => {
    const res = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return res;
  };

  let count = 0;

  return (
    <div style={{ margin: "0 auto", width: "50vw" }}>
      <button onClick={getToken}>Get access token</button>
      <button onClick={handleLogout}>Logout</button>
      <div as="iframe" id="iframe"></div>
      <h1 style={{ textAlign: "left" }}>Transaction List</h1>

      {emailData.map((email, index) => {
        const emailHTML = getMessageBody(email?.payload);
        const { body } = new DOMParser().parseFromString(
          emailHTML,
          "text/html",
        );
        const value = body.querySelector("td").innerText;
        let isTip = value.includes("Tip");

        let restaurant = value.match(/(?<=Dari:\s+).*?(?=\s+-)/gs)?.[0];
        if (isTip) restaurant = "Tip";

        let total = value
          .match(/(?<=Rp\s+).*?(?=\s+WAKTU)/gs)?.[0]
          .replace(/TANGGAL|\|/g, "");

        if (isTip) {
          total = value.match(/(?<=RP\s+).*?(?=\s+Tip)/gs)?.[0];
        }

        count += parseInt(total);

        let date = `${value?.split("WAKTU")[1]?.split(":")?.[0]}:00`;
        if (isTip) {
          date = value.match(/(?<=Dijemput Pada:\s+).*?(?=\s+\+0800)/gs)?.[0];
        }

        return (
          <TransactionItem
            key={date}
            date={date}
            total={total}
            restaurant={restaurant}
          />
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ display: "block" }}>Total:</h2>
        <h2 style={{ display: "block" }}>{`Rp ${formatCurrency(count)}`}</h2>
      </div>
    </div>
  );
};

export default Gmail;
