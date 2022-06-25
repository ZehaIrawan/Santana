import { Box, Button, Switch, Typography } from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { default as moment } from "moment";
import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import "./style.css";

const TransactionList = () => {
  const [transactions, setTransactionts] = useState([]);
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    async function getData() {
      const q = query(
        collection(db, "transactions"),
        orderBy("date", checked ? "asc" : "desc"),
      );

      const querySnapshot = await getDocs(q);

      let res = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.data(), "doc");
        res.push(doc.data());
      });
      if (res.length > 0) {
        setTransactionts(res);
      }
    }
    getData();
  }, [checked]);

  const trxId = "Vs6BzusoM3rCqIG30PYx";

  const handleAdd = async (timeStamp) => {
    const videosRef = doc(db, "transactions", trxId);
    await updateDoc(videosRef, {
      timeStamp,
    });
    alert("ss");
  };

  const sum = transactions.reduce(function (previousValue, currentValue) {
    return previousValue + parseInt(currentValue.total);
  }, 0);

  const formatCurrency = (value) => {
    const res = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return res;
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: "left" }}>Transaction List</h1>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Switch
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
        <Typography>Ascending</Typography>
      </Box>

      {transactions.map((item) => {
        return (
          <div key={item.date}>
            <Button
              onClick={() => handleAdd(moment("07 Jun 22 18:33").format("X"))}
            >
              Add
            </Button>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <span>{item.transactionName}</span>
              <span>{`- Rp ${formatCurrency(item.total)}`}</span>
            </div>
            <span
              style={{
                textAlign: "left",
                display: "block",
                marginTop: "0.2rem",
              }}
            >
              {item.date}
            </span>
            <hr></hr>
          </div>
        );
      })}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ display: "block" }}>Total:</h2>
        <h2 style={{ display: "block" }}>{`Rp ${formatCurrency(sum)}`}</h2>
      </div>
    </div>
  );
};

export default TransactionList;
