import cogoToast from 'cogo-toast';
import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlistItems: []
    },
    reducers: {
        addToWishlist(state, action) {
            const isInWishlist = state.wishlistItems.findIndex(item => item.productId === action.payload.productId);
            if(isInWishlist > -1){
                cogoToast.info("Sản phẩm đã tồn tại", {position: "bottom-left"});
            } else {
                state.wishlistItems.push(action.payload);
                cogoToast.success("Đã thêm vào yêu thích", {position: "bottom-left"});
            }
            
        },
        addToWishlistFormAPI(state, action) {
            const isInWishlist = state.wishlistItems.findIndex(item => item.productId === action.payload.productId);
            if(isInWishlist <= -1){
                state.wishlistItems.push(action.payload);
            }
            
        },
        deleteFromWishlist(state, action){
            state.wishlistItems = state.wishlistItems.filter(item => item.productId !== action.payload);
            cogoToast.error("Đã xóa khỏi yêu thích", {position: "bottom-left"});
        },
        deleteAllFromWishlist(state){
            state.wishlistItems = []
        }
    },
});

export const { addToWishlist,addToWishlistFormAPI, deleteFromWishlist, deleteAllFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;