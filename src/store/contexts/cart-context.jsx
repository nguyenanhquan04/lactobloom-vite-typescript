import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import cogoToast from 'cogo-toast';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
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
        } else if (cartItem !== undefined) {
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

const CartProvider = ({ children }) => {
  // Khôi phục trạng thái từ localStorage
  const initialState = JSON.parse(localStorage.getItem('cartState')) || { cartItems: [] };
  const [cartItemsState, dispatch] = useReducer(cartReducer, initialState);

  // Lưu trạng thái vào localStorage mỗi khi trạng thái thay đổi
  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(cartItemsState));
  }, [cartItemsState]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    cogoToast.success('Đã thêm sản phẩm vào giỏ hàng', { position: 'bottom-left' });
  };

  const deleteFromCart = (cartItemId) => {
    dispatch({ type: 'DELETE_FROM_CART', payload: cartItemId });
    cogoToast.error('Đã xóa khỏi giỏ hàng', { position: 'bottom-left' });
  };

  const decreaseQuantity = (product) => {
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

export const useCart = () => useContext(CartContext);

export default CartProvider;
