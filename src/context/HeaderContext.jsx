import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [isTopHeaderVisible, setIsTopHeaderVisible] = useState(true);

  return (
    <HeaderContext.Provider value={{ isTopHeaderVisible, setIsTopHeaderVisible }}>
      {children}
    </HeaderContext.Provider>
  );
};

HeaderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}; 