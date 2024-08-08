import request from "./axios";

const getImagesByProductId = (productId: number) => {
  return request.get(`image/get/product/${productId}`);
};

const deleteImageByImageId = (token: string, imageId: number) => {
  return request.delete(`image/delete/${imageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const saveImageByProductId = (token: string, formData: any, productId: number) => {
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
