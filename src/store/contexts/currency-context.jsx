import React, { createContext, useReducer, useContext } from 'react';

const CurrencyContext = createContext();

const initialState = {
  currencySymbol: "VND ",
  currencyName: "VND",
  currencyRate: 1
};

const currencyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENCY':
      const currencyName = action.payload;
      if (currencyName === "USD") {
        return {
          currencySymbol: "$",
          currencyRate: 1,
          currencyName
        };
      }
      if (currencyName === "VND") {
        return {
          currencySymbol: "VND ",
          currencyRate: 1,
          currencyName
        };
      }
      return state;
    default:
      return state;
  }
};

const CurrencyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(currencyReducer, initialState);

  const setCurrency = (currencyName) => {
    dispatch({ type: 'SET_CURRENCY', payload: currencyName });
  };

  return (
    <CurrencyContext.Provider value={{ state, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

export default CurrencyProvider;
