import request from "./axios";

const getAvailableVoucher = () => {
  return request.get(`voucher/available`);
};

const exchangeVoucher = (voucherId, config) => {
  return request.put(`voucher/exchange/${voucherId}`, config);
};

const myVoucher = (config) => {
  return request.get(`voucher/myVoucher`, config);
};

const getAllVouchers = (token) => {
  return request.get(`voucher/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteVoucherByVoucherId = (token, voucherId) => {
    return request.delete(`voucher/delete/${voucherId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const updateVoucherByVoucherId = (token, data, voucherId) => {
    return request.put(`voucher/update/${voucherId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const saveVoucher = (token, data) => {
    return request.post(`voucher/save`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

export { getAvailableVoucher, exchangeVoucher, myVoucher, getAllVouchers, deleteVoucherByVoucherId, updateVoucherByVoucherId, saveVoucher };
