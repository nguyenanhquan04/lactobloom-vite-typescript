import request from './axios';

const getAllBlogCategories = () => {
    return request.get(`blog-category/all`);
};

const deleteBlogCategory = (token, blogCategoryId) => {
    return request.delete(`blog-category/delete/${blogCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const getBlogCategoryByBlogId = (blogId) => {
  return request.get(`blog-category/getByBlogId/${blogId}`);
};

const updateBlogCategoryByBlogCategoryId = (token, blogCategory, blogCategoryId) => {
  return request.put(`blog-category/update/${blogCategoryId}`, blogCategory, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const saveBlogCategory = (token, blogCategory) => {
  return request.post(`blog-category/save`, blogCategory, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export { getAllBlogCategories, deleteBlogCategory, getBlogCategoryByBlogId, updateBlogCategoryByBlogCategoryId, saveBlogCategory } 