import request from './axios';

const getAllBrands = () => {
    return request.get(`brand/all`);
};

const getBrandByProductId = (productId: number) => {
    return request.get(`brand/getByProductId/${productId}`);
}

const deleteBrandByBrandId = (token: string, brandId: number) => {
    return request.delete(`brand/delete/${brandId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const updateBrandByBrandId = (token: string, data: any, brandId: number) => {
  return request.put(`brand/update/${brandId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

const saveBrand = (token: string, data: any) => {
  return request.post(`brand/save`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

export { getAllBrands, getBrandByProductId, deleteBrandByBrandId, updateBrandByBrandId, saveBrand } 