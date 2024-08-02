import request from "./axios";

const getImagesByProductId = (productId) => {
  return request.get(`image/get/product/${productId}`);
};

const deleteImageByImageId = (token, imageId) => {
  return request.delete(`image/delete/${imageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const saveImageByProductId = (token, formData, productId) => {
    return request.post(
        `image/save/product/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
}

export { getImagesByProductId, deleteImageByImageId, saveImageByProductId };
