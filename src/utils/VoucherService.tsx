import request from "./axios";

const getAvailableVoucher = () => {
  return request.get(`voucher/available`);
};

const exchangeVoucher = (voucherId: number, config: any) => {
  return request.put(`voucher/exchange/${voucherId}`, config);
};

const myVoucher = (config: any) => {
  return request.get(`voucher/myVoucher`, config);
};

const getAllVouchers = (token: string) => {
  return request.get(`voucher/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteVoucherByVoucherId = (token: string, voucherId: number) => {
    return request.delete(`voucher/delete/${voucherId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const updateVoucherByVoucherId = (token: string, data: any, voucherId: number) => {
    return request.put(`voucher/update/${voucherId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const saveVoucher = (token: string, data: any) => {
    return request.post(`voucher/save`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

export { getAvailableVoucher, exchangeVoucher, myVoucher, getAllVouchers, deleteVoucherByVoucherId, updateVoucherByVoucherId, saveVoucher };
