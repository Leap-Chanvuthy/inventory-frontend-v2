import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  phone_number: string | null;
  profile_picture: string | null;
  role: string;
  email: string;
  email_verified_at: string | null;
  ip_address: string | null;
  device: string | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
