import cogoToast from 'cogo-toast';
import { createSlice } from '@reduxjs/toolkit';

const compareSlice = createSlice({
    name: "compare",
    initialState: {
        compareItems: []
    },
    reducers: {
        addToCompare(state, action) {
            state.compareItems.push(action.payload);
            cogoToast.success("Đã thêm vào so sánh", {position: "bottom-left"});
        },
        deleteFromCompare(state, action){
            state.compareItems = state.compareItems.filter(item => item.productId !== action.payload);
            cogoToast.error("Đã xóa khỏi so sánh", {position: "bottom-left"});
        }
    },
});

export const { addToCompare, deleteFromCompare } = compareSlice.actions;
export default compareSlice.reducer;
