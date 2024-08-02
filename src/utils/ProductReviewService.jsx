import request from './axios';

const getProductReviewByProductId = (productId) => {
    return request.get(`product-review/product/${productId}`);
}

const saveProductReview = (productId, reviewData, config) => {
    return request.post(`product-review/save/product/${productId}`, reviewData, config);
}

const updateProductReview = (reviewId, reviewData, config) => {
    return request.put(`product-review/update/${reviewId}`, reviewData, config);
}

const deleteProductReview = (reviewId, config) => {
    return request.delete(`product-review/deleteMyReview/${reviewId}`, config);
}

export { getProductReviewByProductId, saveProductReview, updateProductReview, deleteProductReview } 