import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import cogoToast from 'cogo-toast';

// Define types for the product and cart items
interface Product {
  productId: number;
  quantity?: number;
  variation?: boolean;
  cartItemId?: any;
  [key: string]: any; // Allows other properties to be included
}

interface CartItem extends Product {
  cartItemId: any;
  quantity: number;
}

// Define the state and action types
interface CartState {
  cartItems: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'DELETE_FROM_CART'; payload: string }
  | { type: 'DECREASE_QUANTITY'; payload: CartItem }
  | { type: 'DELETE_ALL_FROM_CART' };

// Define the context type
interface CartContextType {
  cartItemsState: CartState;
  addToCart: (product: Product) => void;
  deleteFromCart: (cartItemId: string) => void;
  decreaseQuantity: (product: CartItem) => void;
  deleteAllFromCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

// Type the reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = action.payload;
      if (!product.variation) {
        const cartItem = state.cartItems.find(item => item.productId === product.productId);
        if (!cartItem) {
          return {
            ...state,
            cartItems: [...state.cartItems, {
              ...product,
              quantity: product.quantity ? product.quantity : 1,
              cartItemId: uuidv4(),
            }],
          };
        } else {
          return {
            ...state,
            cartItems: state.cartItems.map(item => {
              if (item.cartItemId === cartItem.cartItemId) {
                return {
                  ...item,
                  quantity: product.quantity ? item.quantity + product.quantity : item.quantity + 1,
                };
              }
              return item;
            }),
          };
        }
      } else {
        const cartItem = state.cartItems.find(
          item =>
            item.productId === product.productId &&
            (product.cartItemId ? product.cartItemId === item.cartItemId : true)
        );
        if (!cartItem) {
          return {
            ...state,
            cartItems: [...state.cartItems, {
              ...product,
              quantity: product.quantity ? product.quantity : 1,
              cartItemId: uuidv4(),
            }],
          };
        } else {
          return {
            ...state,
            cartItems: state.cartItems.map(item => {
              if (item.cartItemId === cartItem.cartItemId) {
                return {
                  ...item,
                  quantity: product.quantity ? item.quantity + product.quantity : item.quantity + 1,
                };
              }
              return item;
            }),
          };
        }
      }
    }
    case 'DELETE_FROM_CART': {
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.cartItemId !== action.payload),
      };
    }
    case 'DECREASE_QUANTITY': {
      const product = action.payload;
      if (product.quantity === 1) {
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.cartItemId !== product.cartItemId),
        };
      } else {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.cartItemId === product.cartItemId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
      }
    }
    case 'DELETE_ALL_FROM_CART': {
      return {
        ...state,
        cartItems: [],
      };
    }
    default:
      return state;
  }
};

// Type the provider props
interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const initialState: CartState = JSON.parse(localStorage.getItem('cartState') || '{}') || { cartItems: [] };
  const [cartItemsState, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(cartItemsState));
  }, [cartItemsState]);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    cogoToast.success('Đã thêm sản phẩm vào giỏ hàng', { position: 'bottom-left' });
  };

  const deleteFromCart = (cartItemId: string) => {
    dispatch({ type: 'DELETE_FROM_CART', payload: cartItemId });
    cogoToast.error('Đã xóa khỏi giỏ hàng', { position: 'bottom-left' });
  };

  const decreaseQuantity = (product: CartItem) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: product });
    if (product.quantity === 1) {
      cogoToast.error('Đã xóa khỏi giỏ hàng', { position: 'bottom-left' });
    } else {
      cogoToast.warn('Đã bớt số lượng sản phẩm khỏi giỏ hàng', { position: 'bottom-left' });
    }
  };

  const deleteAllFromCart = () => {
    dispatch({ type: 'DELETE_ALL_FROM_CART' });
  };

  return (
    <CartContext.Provider value={{ cartItemsState, addToCart, deleteFromCart, decreaseQuantity, deleteAllFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;
