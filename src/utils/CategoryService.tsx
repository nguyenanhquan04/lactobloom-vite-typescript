import request from './axios';

const getAllCategories = () => {
    return request.get(`category/all`);
};

const getCategoryByProductId = (productId: number) => {
    return request.get(`category/getByProductId/${productId}`);
}

const deleteCategorydByCategoryId = (token: string, categoryId: number) => {
    return request.delete(`category/delete/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const updateCategoryByCategoryId = (token: string, data: any, categoryId: number) => {
  return request.put(`category/update/${categoryId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

const saveCategory = (token: string, data: any) => {
  return request.post(`category/save`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

export { getAllCategories, getCategoryByProductId, deleteCategorydByCategoryId, updateCategoryByCategoryId, saveCategory } 