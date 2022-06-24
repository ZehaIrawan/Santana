import { createContext } from 'react';
import React, { useState } from 'react';

export const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();


  return (
    <UserContext.Provider
      value={
        (user, setUser, loading, setLoading)
      }
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
