import request from './axios';

const getAllBlogs = () => {
    return request.get(`blog/all`);
};

const getBlogByBlogId = (blogId: number) => {
    return request.get(`blog/get/${blogId}`);
}

const getBlogByBlogCategoryId = (blogCategoryId: number) => {
    return request.get(`blog/blogCategory/${blogCategoryId}`);
}

const deleteBlogByBlogId = (token: string, blogId: number) => {
    return request.delete(`blog/delete/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
}

const saveBlog = (token: string, formData: any, blogCategoryId: number) => {
    return request.post(`blog/save/category/${blogCategoryId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
}

const updateBlogByBlogId = (token: string, formData: any, blogId: number, blogCategoryId: number) => {
    return request.put(`blog/update/${blogId}/category/${blogCategoryId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
}

const searchBlog = (searchTerm: any) => {
    return request.get(`blog/search?title=${searchTerm}`);
}


export { getAllBlogs, getBlogByBlogId, getBlogByBlogCategoryId, deleteBlogByBlogId, searchBlog, saveBlog, updateBlogByBlogId } 