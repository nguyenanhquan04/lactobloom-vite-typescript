import React, { createContext, useReducer, useContext, useEffect, Dispatch, ReactNode } from 'react';

// Define the state type
interface ProductState {
  products: any[]; // Replace any with the actual product type if available
}

// Define the action type
type ProductAction = 
  | { type: 'SET_PRODUCTS'; payload: any[] }; // Adjust the payload type according to your product type

// Define the context type
interface ProductContextProps {
  productsItemsState: ProductState;
  setProduct: (products: any[]) => void;
}

// Initial state
const initialState: ProductState = {
  products: []
};

// Create the context with a default value of null
const ProductContext = createContext<ProductContextProps | null>(null);

// Reducer function
const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    default:
      return state;
  }
};

// Provider component
const ProductProvider = ({ children }: { children: ReactNode }) => {
  const initialProducts = JSON.parse(localStorage.getItem('productsState') || '{}') || initialState;
  const [productsItemsState, dispatch] = useReducer(productReducer, initialProducts);

  useEffect(() => {
    localStorage.setItem('productsState', JSON.stringify(productsItemsState));
  }, [productsItemsState]);

  const setProduct = (products: any[]) => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  };

  return (
    <ProductContext.Provider value={{ productsItemsState, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook to use the product context
export const useProduct = () => useContext(ProductContext);
 

export default ProductProvider;