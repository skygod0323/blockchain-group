import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { translate } from '../localization';

export const LocalizationContext = createContext();

const DEFAULT_LANGUAGE = 'en';

const LocalizationContextProvider = ({ children }) => {
  const [lang, setLang] = useState(DEFAULT_LANGUAGE);
  const t = (word) => {
    return translate(word, lang);
  }

  return <LocalizationContext.Provider value={{ 
    t,
    lang,
    setLang,
  }}>
    {children}
  </LocalizationContext.Provider>;
};

LocalizationContextProvider.propTypes = {
  children: PropTypes.object,
};

export default LocalizationContextProvider;
export const useLocalizationContext = () => useContext(LocalizationContext);