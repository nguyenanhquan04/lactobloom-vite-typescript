import cogoToast from 'cogo-toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for a product in the compare list
interface Product {
    productId: string;
    // Add other product properties if needed
}

// Define the type for the state
interface CompareState {
    compareItems: Product[];
}

// Define the initial state with a type
const initialState: CompareState = {
    compareItems: []
};

const compareSlice = createSlice({
    name: "compare",
    initialState,
    reducers: {
        addToCompare(state, action: PayloadAction<Product>) {
            state.compareItems.push(action.payload);
            cogoToast.success("Đã thêm vào so sánh", { position: "bottom-left" });
        },
        deleteFromCompare(state, action: PayloadAction<string>) {
            state.compareItems = state.compareItems.filter(item => item.productId !== action.payload);
            cogoToast.error("Đã xóa khỏi so sánh", { position: "bottom-left" });
        }
    },
});

export const { addToCompare, deleteFromCompare } = compareSlice.actions;
export default compareSlice.reducer;
