import request from './axios';

const myWishlist = (authToken: string) => {
    return request.get("wishlist/myWishlist", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
}

const saveWishlist = (authToken: string, productId: number) => {
    return request.post(`wishlist/save/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
}

const deleteWishlist = (authToken: string, wishlistId: number) => {
  return request.delete(`wishlist/delete/${wishlistId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
}

export { myWishlist, saveWishlist, deleteWishlist }