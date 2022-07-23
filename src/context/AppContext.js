import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isMemberActivated, setIsMemberActivated] = useState(false);
  const [isMemberJoined, setIsMemberJoined] = useState(false);
  const [message, setMessage] = useState({ open: false });
  const [sidebarToggled, setSidebarToggled] = useState(false);

  return <AppContext.Provider value={{ 
    loading, setLoading, 
    message, setMessage, 
    isMemberActivated, setIsMemberActivated, 
    isMemberJoined, setIsMemberJoined,
    sidebarToggled, setSidebarToggled }}>
    {children}
  </AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.object,
};

export default AppContextProvider;
export const useAppContext = () => useContext(AppContext);