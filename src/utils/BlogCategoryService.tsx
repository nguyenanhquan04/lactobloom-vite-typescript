import request from './axios';

const getAllBlogCategories = () => {
    return request.get(`blog-category/all`);
};

const deleteBlogCategory = (token: string, blogCategoryId: number) => {
    return request.delete(`blog-category/delete/${blogCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
};

const getBlogCategoryByBlogId = (blogId: number) => {
  return request.get(`blog-category/getByBlogId/${blogId}`);
};

const updateBlogCategoryByBlogCategoryId = (token: string, blogCategory: any, blogCategoryId: number) => {
  return request.put(`blog-category/update/${blogCategoryId}`, blogCategory, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const saveBlogCategory = (token: string, blogCategory: any) => {
  return request.post(`blog-category/save`, blogCategory, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export { getAllBlogCategories, deleteBlogCategory, getBlogCategoryByBlogId, updateBlogCategoryByBlogCategoryId, saveBlogCategory } 