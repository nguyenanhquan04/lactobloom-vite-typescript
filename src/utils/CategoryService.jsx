import request from './axios';

const getAllCategories = () => {
    return request.get(`category/all`);
};

const getCategoryByProductId = (productId) => {
    return request.get(`category/getByProductId/${productId}`);
}

const deleteCategorydByCategoryId = (token, categoryId) => {
    return request.delete(`category/delete/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const updateCategoryByCategoryId = (token, data, categoryId) => {
  return request.put(`category/update/${categoryId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

const saveCategory = (token, data) => {
  return request.post(`category/save`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

export { getAllCategories, getCategoryByProductId, deleteCategorydByCategoryId, updateCategoryByCategoryId, saveCategory } 