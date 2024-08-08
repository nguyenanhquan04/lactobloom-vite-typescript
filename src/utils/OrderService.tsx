import request from './axios';

const saveOrderInfo = (voucherId: number, data: any, config: any) => {
    return request.post(`order/save${voucherId ? `?voucherId=${voucherId}` : ""}`, data, config);
}

const getAllOrders = (token: string) => {
    return request.get('order/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getStaffOrders = (token: string) => {
    return request.get('order/staffOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const deleteOrderByOrderId = (token: string, orderId: number) => {
    return request.delete(`order/delete/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const deliverOrderByOrderId = (token: string, orderId: number) => {
    return request.put(`order/deliver/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const updateOrder = (token: string, data:any , orderId: number, selectedStaffId: number) => {
  return request.put(`order/update/${orderId}${selectedStaffId ? `?staffId=${selectedStaffId}` : ""}`,data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const cancelOrderByOrderId = (token: string, orderId: number) => {
  return request.put(`order/cancel/${orderId}`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const calculateOrderTotal = (token: string, orderId: number) => {
  return request.put(`order/${orderId}/total`,{}, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export { saveOrderInfo, getAllOrders, getStaffOrders, deleteOrderByOrderId, deliverOrderByOrderId, updateOrder, cancelOrderByOrderId, calculateOrderTotal} 