import request from './axios';

const getAllBlogs = () => {
    return request.get(`blog/all`);
};

const getBlogByBlogId = (blogId) => {
    return request.get(`blog/get/${blogId}`);
}

const getBlogByBlogCategoryId = (blogCategoryId) => {
    return request.get(`blog/blogCategory/${blogCategoryId}`);
}

const deleteBlogByBlogId = (token, blogId) => {
    return request.delete(`blog/delete/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
}

const saveBlog = (token, formData, blogCategoryId) => {
    return request.post(`blog/save/category/${blogCategoryId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
}

const updateBlogByBlogId = (token, formData, blogId, blogCategoryId) => {
    return request.put(`blog/update/${blogId}/category/${blogCategoryId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
}

const searchBlog = (searchTerm) => {
    return request.get(`blog/search?title=${searchTerm}`);
}


export { getAllBlogs, getBlogByBlogId, getBlogByBlogCategoryId, deleteBlogByBlogId, searchBlog, saveBlog, updateBlogByBlogId } 