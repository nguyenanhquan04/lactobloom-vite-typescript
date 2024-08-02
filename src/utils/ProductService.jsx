import request from './axios';

const getAllProducts = () => {
    return request.get(`product/all`);
};

const getProductsByCategoryId = (categoryId) => {
    return request.get(`product/category/${categoryId}`);
};

const getProductsByBrandId = (brandId) => {
    return request.get(`product/brand/${brandId}`);
}

const getProductByProductId = (productId) => {
    return request.get(`product/get/${productId}`);
}

const get4RandomProducts = () => {
    return request.get(`product/random`);
};

const deleteProductByProductId = (token, productId) => {
    return request.delete(`product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const searchProducts = (params) => {
    return request.get(`product/search`, params);
};

const updateProductByProductId = (token, data, productId, brandId, categoryId) => {
    return request.put(`product/update/${productId}/brand/${brandId}/category/${categoryId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const saveProduct= (token, data, brandId, categoryId) => {
    return request.post(`product/save/brand/${brandId}/category/${categoryId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

export { getAllProducts, searchProducts, getProductsByCategoryId, getProductsByBrandId, getProductByProductId, get4RandomProducts, deleteProductByProductId, updateProductByProductId, saveProduct };