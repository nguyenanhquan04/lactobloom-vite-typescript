import request from './axios';

const createPayment = (finalAmount) => {
    return request.get(`payment/create-payment?amount=${finalAmount}&bankCode=NCB`);
};

const transactionStatus = (transactionId) => {
    return request.get(`payment/transaction-status?transactionId=${transactionId}`);
}

export { createPayment,transactionStatus } 