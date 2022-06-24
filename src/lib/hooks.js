import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

export function useUserData() {
  const [user, loading, error] = useAuthState(auth);

  // console.log(user, loading, error, "hooks");
  // useEffect(() => {
  //   // turn off realtime subscription
  //   let unsubscribe;

  //   // if (user) {
  //   //   const ref = firestore.collection('users').doc(user.uid);
  //   // }
  //   return unsubscribe;
  // }, [user]);
  // console.log(selectedVideo);
  return { user, loading, error };
}
