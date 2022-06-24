import { Button, CircularProgress } from "@mui/material";
import { signInWithRedirect } from "firebase/auth";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import { auth, googleAuthProvider } from "../../lib/firebase";
import { useUserData } from "../../lib/hooks";

export const LoginPage = () => {
  // const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const userData = useUserData();

  const { user, loading } = userData;

  // useEffect(() => {
  //   async function checkUserExist() {
  //     if (currentUser) {
  //       const docRef = doc(db, "users", currentUser.uid);

  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         console.log('Document data:', docSnap.data());
  //       } else {
  //         await setDoc(doc(db, users, currentUser.uid), {
  //           createdAt: Date.now(),
  //           displayName: currentUser.displayName,
  //           email: currentUser.email,
  //         });
  //       }
  //     }
  //   }
  //   checkUserExist();
  // }, [currentUser]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  function SignInButton() {
    const signInWithGoogle = async () => {
      await signInWithRedirect(auth, googleAuthProvider);
    };

    return (
      <Button variant="contained" onClick={signInWithGoogle}>
        Sign In with Google
      </Button>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Login Page</title>
        <meta name="Login-page" content="Login page" />
      </Helmet>
      {loading && <CircularProgress />}
      {!user && !loading && (
        <div>
          <SignInButton />
        </div>
      )}
    </div>
  );
};
