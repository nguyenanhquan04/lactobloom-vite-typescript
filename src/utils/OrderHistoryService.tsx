import request from './axios';

const myOrders = (config: any) => {
    return request.get(`order/myOrders`, config);
}

export { myOrders } 