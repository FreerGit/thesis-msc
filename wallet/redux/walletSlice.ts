import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
    walletExists: boolean;
    isAuthenticated: boolean;
}

const initialState: WalletState = {
    walletExists: false,
    isAuthenticated: false,
};

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setWalletExists: (state, action: PayloadAction<boolean>) => {
            state.walletExists = action.payload;
        },
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        }
    },
});

export const { setWalletExists, setIsAuthenticated } = walletSlice.actions;
export default walletSlice.reducer;
