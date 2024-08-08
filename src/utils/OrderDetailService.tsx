import request from './axios';

const orderProducts = (orderId: number, config: any) => {
    return request.get(`order-detail/myOrder/${orderId}`, config);
}

const getOrderProducts = (token: string, orderId: number) => {
    return request.get(`order-detail/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const saveOrderProduct = (token: string, orderId: number, productId: number, data: any) => {
  return request.post(`order-detail/save/order/${orderId}/product/${productId}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export { orderProducts, getOrderProducts, saveOrderProduct } 