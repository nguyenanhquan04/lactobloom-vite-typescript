import request from './axios';

const getAllBrands = () => {
    return request.get(`brand/all`);
};

const getBrandByProductId = (productId) => {
    return request.get(`brand/getByProductId/${productId}`);
}

const deleteBrandByBrandId = (token, brandId) => {
    return request.delete(`brand/delete/${brandId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const updateBrandByBrandId = (token, data, brandId) => {
  return request.put(`brand/update/${brandId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

const saveBrand = (token, data) => {
  return request.post(`brand/save`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

export { getAllBrands, getBrandByProductId, deleteBrandByBrandId, updateBrandByBrandId, saveBrand } 