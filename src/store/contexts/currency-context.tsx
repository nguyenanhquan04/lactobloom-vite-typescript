import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// Define the state type
interface CurrencyState {
  currencySymbol: string;
  currencyName: string;
  currencyRate: number;
}

// Define the action type
interface SetCurrencyAction {
  type: 'SET_CURRENCY';
  payload: string;
}

type CurrencyAction = SetCurrencyAction;

const initialState: CurrencyState = {
  currencySymbol: 'VND ',
  currencyName: 'VND',
  currencyRate: 1,
};

// Type the reducer function
const currencyReducer = (state: CurrencyState, action: CurrencyAction): CurrencyState => {
  switch (action.type) {
    case 'SET_CURRENCY':
      const currencyName = action.payload;
      if (currencyName === 'USD') {
        return {
          currencySymbol: '$',
          currencyRate: 1,
          currencyName,
        };
      }
      if (currencyName === 'VND') {
        return {
          currencySymbol: 'VND ',
          currencyRate: 1,
          currencyName,
        };
      }
      return state;
    default:
      return state;
  }
};

// Define the context type
interface CurrencyContextType {
  currencyState: CurrencyState;
  setCurrency: (currencyName: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Type the provider props
interface CurrencyProviderProps {
  children: ReactNode;
}

const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currencyState, dispatch] = useReducer(currencyReducer, initialState);

  const setCurrency = (currencyName: string) => {
    dispatch({ type: 'SET_CURRENCY', payload: currencyName });
  };

  return (
    <CurrencyContext.Provider value={{ currencyState, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use the currency context
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyProvider;
