import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  account: any; // bạn có thể định nghĩa interface chi tiết hơn
}

const initialState: AuthState = {
  token: "",
  account: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setAccount(state, action: PayloadAction<any>) {
      state.account = action.payload;
    },
    logout(state) {
      state.token = "";
      state.account = null;
    },
  },
});

export const { setToken, setAccount, logout } = authSlice.actions;
export default authSlice.reducer;
