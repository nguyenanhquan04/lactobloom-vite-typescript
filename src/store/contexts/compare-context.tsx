import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import cogoToast from 'cogo-toast';

// Define types for the product and state
interface Product {
  productId: number;
  [key: string]: any; // Allows other properties to be included
}

interface CompareState {
  compareItems: Product[];
}

type CompareAction =
  | { type: 'ADD_TO_COMPARE'; payload: Product }
  | { type: 'DELETE_FROM_COMPARE'; payload: string };

// Define the context type
interface CompareContextType {
  compareItemsState: CompareState;
  addToCompare: (product: Product) => void;
  deleteFromCompare: (productId: string) => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

// Type the reducer function
const compareReducer = (state: CompareState, action: CompareAction): CompareState => {
  switch (action.type) {
    case 'ADD_TO_COMPARE': {
      const newItem = action.payload;
      // Check if the product is already in the compare list
      if (state.compareItems.find(item => item.productId === newItem.productId)) {
        cogoToast.warn('Sản phẩm đã có trong danh sách so sánh', { position: 'bottom-left' });
        return state;
      }
      return {
        ...state,
        compareItems: [...state.compareItems, newItem],
      };
    }
    case 'DELETE_FROM_COMPARE': {
      return {
        ...state,
        compareItems: state.compareItems.filter((item: any) => item.productId !== action.payload),
      };
    }
    default:
      return state;
  }
};

// Type the provider props
interface CompareProviderProps {
  children: ReactNode;
}

const CompareProvider: React.FC<CompareProviderProps> = ({ children }) => {
  // Restore state from localStorage
  const initialState: CompareState = JSON.parse(localStorage.getItem('compareState') || '{}') || { compareItems: [] };
  const [compareItemsState, dispatch] = useReducer(compareReducer, initialState);

  // Save state to localStorage whenever the compare state changes
  useEffect(() => {
    localStorage.setItem('compareState', JSON.stringify(compareItemsState));
  }, [compareItemsState]);

  const addToCompare = (product: Product) => {
    dispatch({ type: 'ADD_TO_COMPARE', payload: product });
    cogoToast.success("Đã thêm vào so sánh", { position: "bottom-left" });
  };

  const deleteFromCompare = (productId: string) => {
    dispatch({ type: 'DELETE_FROM_COMPARE', payload: productId });
    cogoToast.error("Đã xóa khỏi so sánh", { position: "bottom-left" });
  };

  return (
    <CompareContext.Provider value={{ compareItemsState, addToCompare, deleteFromCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export default CompareProvider;
