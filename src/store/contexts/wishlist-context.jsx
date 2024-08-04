import React, { createContext, useReducer, useContext } from 'react';
import cogoToast from 'cogo-toast';

const WishlistContext = createContext();

const initialState = {
  wishlistItems: []
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      const isInWishlist = state.wishlistItems.findIndex(item => item.productId === action.payload.productId);
      if (isInWishlist > -1) {
        cogoToast.info("Sản phẩm đã tồn tại", { position: "bottom-left" });
        return state;
      } else {
        cogoToast.success("Đã thêm vào yêu thích", { position: "bottom-left" });
        return {
          ...state,
          wishlistItems: [...state.wishlistItems, action.payload]
        };
      }
    case 'ADD_TO_WISHLIST_FROM_API':
      const isInWishlistAPI = state.wishlistItems.findIndex(item => item.productId === action.payload.productId);
      if (isInWishlistAPI <= -1) {
        return {
          ...state,
          wishlistItems: [...state.wishlistItems, action.payload]
        };
      }
      return state;
    case 'DELETE_FROM_WISHLIST':
      cogoToast.error("Đã xóa khỏi yêu thích", { position: "bottom-left" });
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(item => item.productId !== action.payload)
      };
    case 'DELETE_ALL_FROM_WISHLIST':
      return {
        ...state,
        wishlistItems: []
      };
    default:
      return state;
  }
};

const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const addToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const addToWishlistFromAPI = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST_FROM_API', payload: product });
  };

  const deleteFromWishlist = (productId) => {
    dispatch({ type: 'DELETE_FROM_WISHLIST', payload: productId });
  };

  const deleteAllFromWishlist = () => {
    dispatch({ type: 'DELETE_ALL_FROM_WISHLIST' });
  };

  return (
    <WishlistContext.Provider value={{ state, addToWishlist, addToWishlistFromAPI, deleteFromWishlist, deleteAllFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

export default WishlistProvider;
