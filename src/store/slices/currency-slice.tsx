import { createSlice } from '@reduxjs/toolkit';

const currencySlice = createSlice({
    name: "currency",
    initialState: {
        currencySymbol: "VND ",
        currencyName: "VND",
        currencyRate: 1
    },
    reducers: {
        setCurrency(state, action) {
            const currencyName = action.payload;

            if (currencyName === "USD") {
                return state = {
                    currencySymbol: "$",
                    currencyRate: 1,
                    currencyName
                };
            }
            if (currencyName === "VND") {
                return state = {
                    currencySymbol: "VND ",
                    currencyRate: 1,
                    currencyName
                };
            }
        }
    },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
