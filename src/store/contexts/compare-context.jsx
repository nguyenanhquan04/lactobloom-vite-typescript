import React, { createContext, useReducer, useContext, useEffect } from 'react';
import cogoToast from 'cogo-toast';

const CompareContext = createContext(null);

const compareReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_COMPARE': {
      const newItem = action.payload;
      // Kiểm tra nếu sản phẩm đã có trong danh sách so sánh
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
        compareItems: state.compareItems.filter(item => item.productId !== action.payload),
      };
    }
    default:
      return state;
  }
};

const CompareProvider = ({ children }) => {
  // Khôi phục trạng thái từ localStorage
  const initialState = JSON.parse(localStorage.getItem('compareState')) || { compareItems: [] };
  const [compareItemsState, dispatch] = useReducer(compareReducer, initialState);

  // Lưu trạng thái vào localStorage mỗi khi trạng thái so sánh thay đổi
  useEffect(() => {
    localStorage.setItem('compareState', JSON.stringify(compareItemsState));
  }, [compareItemsState]);

  const addToCompare = (product) => {
    dispatch({ type: 'ADD_TO_COMPARE', payload: product });
    cogoToast.success("Đã thêm vào so sánh", { position: "bottom-left" });
  };

  const deleteFromCompare = (productId) => {
    dispatch({ type: 'DELETE_FROM_COMPARE', payload: productId });
    cogoToast.error("Đã xóa khỏi so sánh", { position: "bottom-left" });
  };

  return (
    <CompareContext.Provider value={{ compareItemsState, addToCompare, deleteFromCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);

export default CompareProvider;
