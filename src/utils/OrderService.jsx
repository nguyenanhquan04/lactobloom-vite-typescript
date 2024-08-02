import request from './axios';

const saveOrderInfo = (voucherId, data, config) => {
    return request.post(`order/save${voucherId ? `?voucherId=${voucherId}` : ""}`, data, config);
}

const getAllOrders = (token) => {
    return request.get('order/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getStaffOrders = (token) => {
    return request.get('order/staffOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const deleteOrderByOrderId = (token, orderId) => {
    return request.delete(`order/delete/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const deliverOrderByOrderId = (token, orderId) => {
    return request.put(`order/deliver/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const updateOrder = (token, data, orderId, selectedStaffId) => {
  return request.put(`order/update/${orderId}${selectedStaffId ? `?staffId=${selectedStaffId}` : ""}`,data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const cancelOrderByOrderId = (token, orderId) => {
  return request.put(`order/cancel/${orderId}`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const calculateOrderTotal = (token, orderId) => {
  return request.put(`order/${orderId}/total`,{}, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export { saveOrderInfo, getAllOrders, getStaffOrders, deleteOrderByOrderId, deliverOrderByOrderId, updateOrder, cancelOrderByOrderId, calculateOrderTotal} 