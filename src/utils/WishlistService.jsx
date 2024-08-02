import request from './axios';

const myWishlist = (authToken) => {
    return request.get("wishlist/myWishlist", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
}

const saveWishlist = (authToken, productId) => {
    return request.post(`wishlist/save/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
}

const deleteWishlist = (authToken, wishlistId) => {
  return request.delete(`wishlist/delete/${wishlistId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
}

export { myWishlist, saveWishlist, deleteWishlist }