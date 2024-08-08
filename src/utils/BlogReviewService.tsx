import request from './axios';

const getBlogReviewByBlogId = (blogId: number) => {
    return request.get(`blog-review/blog/${blogId}`);
}

const saveBlogReview = (blogId: number, reviewData: any, config: any) => {
    return request.post(`blog-review/save/blog/${blogId}`, reviewData, config);
}

const updateBlogReview = (reviewId: number, reviewData: any, config: any) => {
    return request.put(`blog-review/update/${reviewId}`, reviewData, config);
}

const deleteBlogReview = (reviewId: number, config: any) => {
    return request.delete(`blog-review/deleteMyReview/${reviewId}`, config);
}

export { getBlogReviewByBlogId, saveBlogReview, updateBlogReview, deleteBlogReview }