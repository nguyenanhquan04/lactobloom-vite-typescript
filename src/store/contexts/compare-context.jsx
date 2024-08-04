import React, { createContext, useReducer, useContext } from 'react';
import cogoToast from 'cogo-toast';

const CompareContext = createContext();

const compareReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_COMPARE':
      return {
        ...state,
        compareItems: [...state.compareItems, action.payload],
      };
    case 'DELETE_FROM_COMPARE':
      return {
        ...state,
        compareItems: state.compareItems.filter(item => item.productId !== action.payload),
      };
    default:
      return state;
  }
};

const CompareProvider = ({ children }) => {
  const [state, dispatch] = useReducer(compareReducer, { compareItems: [] });

  const addToCompare = (product) => {
    dispatch({ type: 'ADD_TO_COMPARE', payload: product });
    cogoToast.success("Đã thêm vào so sánh", { position: "bottom-left" });
  };

  const deleteFromCompare = (productId) => {
    dispatch({ type: 'DELETE_FROM_COMPARE', payload: productId });
    cogoToast.error("Đã xóa khỏi so sánh", { position: "bottom-left" });
  };

  return (
    <CompareContext.Provider value={{ state, addToCompare, deleteFromCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);

export default CompareProvider;
