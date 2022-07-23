import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  return <UserContext.Provider value={{ userInfo, setUserInfo, loadingUserInfo, setLoadingUserInfo }}>
    {children}
  </UserContext.Provider>;
};

UserContextProvider.propTypes = {
  children: PropTypes.object,
};

export default UserContextProvider;
export const useUserContext = () => useContext(UserContext);