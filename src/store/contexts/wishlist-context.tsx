import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import cogoToast from 'cogo-toast';

// Define the structure of a wishlist item
interface WishlistItem {
  productId: number;
  // Add any other properties relevant to your product
}

// Define the structure of the state
interface WishlistState {
  wishlistItems: WishlistItem[];
}

// Define action types
type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'ADD_TO_WISHLIST_FROM_API'; payload: WishlistItem }
  | { type: 'DELETE_FROM_WISHLIST'; payload: number }
  | { type: 'DELETE_ALL_FROM_WISHLIST' };

const initialState: WishlistState = {
  wishlistItems: []
};

// Type the reducer function
const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
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
    }
    case 'ADD_TO_WISHLIST_FROM_API': {
      const isInWishlistAPI = state.wishlistItems.findIndex(item => item.productId === action.payload.productId);
      if (isInWishlistAPI <= -1) {
        return {
          ...state,
          wishlistItems: [...state.wishlistItems, action.payload]
        };
      }
      return state;
    }
    case 'DELETE_FROM_WISHLIST': {
      cogoToast.error("Đã xóa khỏi yêu thích", { position: "bottom-left" });
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter((item: any) => item.productId !== action.payload)
      };
    }
    case 'DELETE_ALL_FROM_WISHLIST': {
      return {
        ...state,
        wishlistItems: []
      };
    }
    default:
      return state;
  }
};

// Define the context type
interface WishlistContextType {
  wishlistItemsState: WishlistState;
  addToWishlist: (product: WishlistItem) => void;
  addToWishlistFromAPI: (product: WishlistItem) => void;
  deleteFromWishlist: (productId: number) => void;
  deleteAllFromWishlist: () => void;
}

// Define the provider props
interface WishlistProviderProps {
  children: ReactNode;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const initialWishlistState: WishlistState = JSON.parse(localStorage.getItem('wishlistState') || '{}') || initialState;
  const [wishlistItemsState, dispatch] = useReducer(wishlistReducer, initialWishlistState);

  useEffect(() => {
    localStorage.setItem('wishlistState', JSON.stringify(wishlistItemsState));
  }, [wishlistItemsState]);

  const addToWishlist = (product: WishlistItem) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const addToWishlistFromAPI = (product: WishlistItem) => {
    dispatch({ type: 'ADD_TO_WISHLIST_FROM_API', payload: product });
  };

  const deleteFromWishlist = (productId: number) => {
    dispatch({ type: 'DELETE_FROM_WISHLIST', payload: productId });
  };

  const deleteAllFromWishlist = () => {
    dispatch({ type: 'DELETE_ALL_FROM_WISHLIST' });
  };

  return (
    <WishlistContext.Provider value={{ wishlistItemsState, addToWishlist, addToWishlistFromAPI, deleteFromWishlist, deleteAllFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistProvider;
