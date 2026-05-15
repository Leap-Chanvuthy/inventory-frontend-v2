import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id?: number;
  name: string;
  phone_number: string | null;
  profile_picture: string | null;
  role: {
    id: number;
    name: string;
    key: string;
    is_system: boolean;
    updated_at?: string | null;
  } | null;
  permissions: string[];
  permissions_version?: number | null;
  email: string;
  email_verified_at: string | null;
  ip_address: string | null;
  device: string | null;
  last_activity: string | null;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  permissions: string[];
  authResolved: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  permissions: [],
  authResolved: false,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.permissions = action.payload.user.permissions || [];
      state.authResolved = true;
    },
    setCurrentUserFromServer: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.permissions = action.payload.permissions || [];
      state.authResolved = true;
    },
    setAuthResolved: (state, action: PayloadAction<boolean>) => {
      state.authResolved = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.permissions = [];
      state.authResolved = true;
    },
    updateUserLoginInformation: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.permissions = state.user.permissions || [];
      }
    },
  },
});

export const { login, logout, updateUserLoginInformation, setCurrentUserFromServer, setAuthResolved } = authSlice.actions;
export default authSlice.reducer;
