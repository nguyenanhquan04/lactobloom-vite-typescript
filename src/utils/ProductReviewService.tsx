import request from './axios';

const getProductReviewByProductId = (productId: number) => {
    return request.get(`product-review/product/${productId}`);
}

const saveProductReview = (productId: number, reviewData: any, config: any) => {
    return request.post(`product-review/save/product/${productId}`, reviewData, config);
}

const updateProductReview = (reviewId: number, reviewData: any, config: any) => {
    return request.put(`product-review/update/${reviewId}`, reviewData, config);
}

const deleteProductReview = (reviewId: number, config: any) => {
    return request.delete(`product-review/deleteMyReview/${reviewId}`, config);
}

export { getProductReviewByProductId, saveProductReview, updateProductReview, deleteProductReview } 