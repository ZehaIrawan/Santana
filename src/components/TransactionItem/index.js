import React from "react";
import "./style.css";
const TransactionItem = ({ date, restaurant, total }) => {
  return (
    <div className="container" key={date}>
      {/* <div key={date}> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <span>{restaurant}</span>
        <span>{`- Rp ${total.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</span>
      </div>
      <span
        style={{ textAlign: "left", display: "block", marginTop: "0.2rem" }}
      >
        {date}
      </span>
      {/* </div> */}
    </div>
  );
};

export default TransactionItem;
