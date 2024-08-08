import request from './axios';

const createPayment = (finalAmount: number) => {
    return request.get(`payment/create-payment?amount=${finalAmount}&bankCode=NCB`);
};

const transactionStatus = (transactionId: any) => {
    return request.get(`payment/transaction-status?transactionId=${transactionId}`);
}

export { createPayment,transactionStatus } 