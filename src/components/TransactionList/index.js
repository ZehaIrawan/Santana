import { collection, getDocs } from "firebase/firestore";
import { default as moment } from "moment";
import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import "./style.css";

const TransactionList = () => {
  const [transactions, setTransactionts] = useState([]);

  useEffect(() => {
    async function getData() {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      let res = [];
      querySnapshot.forEach((doc) => {
        res.push(doc.data());
      });
      if (res.length > 0) {
        setTransactionts(res);
      }
    }
    getData();
  }, []);

  // const data = [
  //   {
  //     date: "07 Jun 22 18:33",
  //     restaurant: "Nasi Kulit Syuurga",
  //     total: "94750",
  //   },
  //   {
  //     date: "10 Jun 22 17:57",
  //     restaurant: "Ayam Gedebuk Samarinda",
  //     total: "82000",
  //   },
  // ];

  console.log(transactions);

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

      {transactions.map((item) => {
        console.log(moment(item.date).fromNow());
        return (
          <div key={item.date}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <span>{item.restaurant}</span>
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
