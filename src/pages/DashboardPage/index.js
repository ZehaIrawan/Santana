import { Typography } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
// import { useAuth } from "../../context/AuthContext";
import { useUserData } from "../../lib/hooks";

export const DashboardPage = () => {
  // const { loading, currentUser } = useAuth();

  const userData = useUserData();

  const { user, loading } = userData;
  return (
    <>
      <Helmet>
        <title>Dashboard Page</title>
        <meta name="Dashboard-page" content="Dashboard page" />
      </Helmet>
      <Layout isLoading={loading}>
        <Typography>{user?.displayName} </Typography>
        <Typography>{user?.email}</Typography>
      </Layout>
    </>
  );
};
