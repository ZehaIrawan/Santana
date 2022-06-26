import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../lib/hooks";
// import { useAuth } from "../../context/AuthContext";
import NavigationBar from "./NavigationBar";

const Layout = (props) => {
  const { isLoading, children } = props;
  const navigate = useNavigate();

  const userData = useUserData();

  const { user, loading } = userData;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  console.log(isLoading);
  return (
    <>
      <NavigationBar />
      {isLoading ? (
        <CircularProgress style={{ margin: "0 auto" }} />
      ) : (
        <>
          <div>{children}</div>
        </>
      )}
    </>
  );
};

export default Layout;
