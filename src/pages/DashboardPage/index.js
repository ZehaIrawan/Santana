import React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import TransactionList from "../../components/TransactionList";
import { useUserData } from "../../lib/hooks";

export const DashboardPage = () => {
  const userData = useUserData();

  const { user, loading } = userData;

  return (
    <>
      <Helmet>
        <title>Dashboard Page</title>
        <meta name="Dashboard-page" content="Dashboard page" />
      </Helmet>
      <Layout isLoading={loading}>
        <TransactionList />
      </Layout>
    </>
  );
};
