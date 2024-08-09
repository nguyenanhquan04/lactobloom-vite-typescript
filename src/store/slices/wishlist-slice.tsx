import cogoToast from 'cogo-toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for a product in the wishlist
interface Product {
    productId: string;
    // Add other product properties if needed
}

// Define the type for the state
interface WishlistState {
    wishlistItems: Product[];
}

// Define the initial state with a type
const initialState: WishlistState = {
    wishlistItems: []
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addToWishlist(state, action: PayloadAction<Product>) {
            const isInWishlist = state.wishlistItems.findIndex(item => item.productId === action.payload.productId);
            if (isInWishlist > -1) {
                cogoToast.info("Sản phẩm đã tồn tại", { position: "bottom-left" });
            } else {
                state.wishlistItems.push(action.payload);
                cogoToast.success("Đã thêm vào yêu thích", { position: "bottom-left" });
            }
        },
        addToWishlistFormAPI(state, action: PayloadAction<Product>) {
            const isInWishlist = state.wishlistItems.findIndex(item => item.productId === action.payload.productId);
            if (isInWishlist <= -1) {
                state.wishlistItems.push(action.payload);
            }
        },
        deleteFromWishlist(state, action: PayloadAction<string>) {
            state.wishlistItems = state.wishlistItems.filter(item => item.productId !== action.payload);
            cogoToast.error("Đã xóa khỏi yêu thích", { position: "bottom-left" });
        },
        deleteAllFromWishlist(state) {
            state.wishlistItems = [];
        }
    },
});

export const { addToWishlist, addToWishlistFormAPI, deleteFromWishlist, deleteAllFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
