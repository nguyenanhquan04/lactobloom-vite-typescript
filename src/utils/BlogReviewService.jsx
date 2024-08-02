import request from './axios';

const getBlogReviewByBlogId = (blogId) => {
    return request.get(`blog-review/blog/${blogId}`);
}

const saveBlogReview = (blogId, reviewData, config) => {
    return request.post(`blog-review/save/blog/${blogId}`, reviewData, config);
}

const updateBlogReview = (reviewId, reviewData, config) => {
    return request.put(`blog-review/update/${reviewId}`, reviewData, config);
}

const deleteBlogReview = (reviewId, config) => {
    return request.delete(`blog-review/deleteMyReview/${reviewId}`, config);
}

export { getBlogReviewByBlogId, saveBlogReview, updateBlogReview, deleteBlogReview }