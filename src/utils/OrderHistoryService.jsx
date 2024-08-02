import request from './axios';

const myOrders = (config) => {
    return request.get(`order/myOrders`, config);
}

export { myOrders } 