import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
    walletExists: boolean;
}

const initialState: WalletState = {
    walletExists: false,
};

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setWalletExists: (state, action: PayloadAction<boolean>) => {
            state.walletExists = action.payload;
        },
    },
});

export const { setWalletExists } = walletSlice.actions;
export default walletSlice.reducer;
