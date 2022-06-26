import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Switch, TextField, Typography } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../lib/firebase";

import "./style.css";

const TransactionList = () => {
  const [transactions, setTransactionts] = useState([]);
  const [checked, setChecked] = React.useState(true);

  const { register, handleSubmit } = useForm();

  const [isHovering, setIsHovering] = useState(null);

  const handleMouseOver = (date) => {
    setIsHovering(date);
  };

  const handleMouseOut = () => {
    setIsHovering();
  };

  const onSubmit = async (payload) => {
    let { transactionName, total, date } = payload;
    date = moment(date).format("DD MMM YY h:mm");

    await addDoc(collection(db, "transactions"), {
      transactionName,
      total,
      date,
    });
  };

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
        let trx = doc.data();
        trx.id = doc.id;
        res.push(trx);
      });
      if (res.length > 0) {
        setTransactionts(res);
      }
    }
    getData();
  }, [checked]);

  const sum = transactions.reduce(function (previousValue, currentValue) {
    return previousValue + parseInt(currentValue.total);
  }, 0);

  const formatCurrency = (value) => {
    const res = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return res;
  };

  async function deleteTransaction() {
    try {
      await deleteDoc(doc(db, "transactions", isHovering));
    } catch (error) {
      console.log(error, "ERR");
    }
  }

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

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "1rem 0 1rem 0",
          gap: "1rem",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          label="Transaction Name"
          {...register("transactionName")}
        ></TextField>
        <TextField
          label="total"
          type="number"
          {...register("total")}
        ></TextField>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="Date&Time picker"
            {...register("date")}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button type="submit">Submit</Button>
      </form>

      {transactions.map((item) => {
        return (
          <div
            key={item.id}
            onMouseOver={() => handleMouseOver(item.id)}
            onMouseOut={() => handleMouseOut()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <span>{item.transactionName}</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>{`- Rp ${formatCurrency(item.total)}`}</span>
                {isHovering === item.id && (
                  <DeleteIcon
                    onClick={deleteTransaction}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </div>
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
