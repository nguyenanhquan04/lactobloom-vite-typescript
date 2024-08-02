import request from './axios';

const orderProducts = (orderId, config) => {
    return request.get(`order-detail/myOrder/${orderId}`, config);
}

const getOrderProducts = (token, orderId) => {
    return request.get(`order-detail/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const saveOrderProduct = (token, orderId, productId, data) => {
  return request.post(`order-detail/save/order/${orderId}/product/${productId}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export { orderProducts, getOrderProducts, saveOrderProduct } 