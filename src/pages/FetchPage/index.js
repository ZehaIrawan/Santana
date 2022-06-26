import Gmail from "../../components/Gmail";
import Layout from "../../components/Layout";
import { useUserData } from "../../lib/hooks";

const FetchPage = () => {
  const userData = useUserData();

  const { user, loading } = userData;
  return (
    <Layout isLoading={loading}>
      <Gmail />
    </Layout>
  );
};

export default FetchPage;
