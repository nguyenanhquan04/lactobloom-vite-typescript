import request from './axios';

const getAllProducts = () => {
    return request.get(`product/all`);
};

const getProductsByCategoryId = (categoryId: number) => {
    return request.get(`product/category/${categoryId}`);
};

const getProductsByBrandId = (brandId: number) => {
    return request.get(`product/brand/${brandId}`);
}

const getProductByProductId = (productId: number) => {
    return request.get(`product/get/${productId}`);
}

const get4RandomProducts = () => {
    return request.get(`product/random`);
};

const deleteProductByProductId = (token: string, productId: number) => {
    return request.delete(`product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const searchProducts = (params: any) => {
    return request.get(`product/search`, params);
};

const updateProductByProductId = (token: string, data: any, productId: number, brandId: number, categoryId: number) => {
    return request.put(`product/update/${productId}/brand/${brandId}/category/${categoryId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const saveProduct= (token: string, data: any, brandId: number, categoryId: number) => {
    return request.post(`product/save/brand/${brandId}/category/${categoryId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

export { getAllProducts, searchProducts, getProductsByCategoryId, getProductsByBrandId, getProductByProductId, get4RandomProducts, deleteProductByProductId, updateProductByProductId, saveProduct };