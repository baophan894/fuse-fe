import { authAPI } from '@/store/queries/auth';
import webStorageClient from '@/utils/webStorageClient';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthSlickInterface {
  userInfo: any;
  access_token: any;
}

const initialState: AuthSlickInterface = {
  userInfo: null,
  access_token: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    actionLogin: (
      state,
      action: PayloadAction<{
        username: string;
        password: string;
        isRemember: boolean;
      }>
    ) => {}
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authAPI.endpoints.signIn.matchFulfilled,
      (state, action) => {
        webStorageClient.setToken(action?.payload?.data?.accessToken);
        state.access_token = action?.payload?.data?.accessToken;
      }
    );
    builder.addMatcher(
      authAPI.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        const userInfo = {
          isBlueBadge: action.payload.data?.isBlueBadge ?? false,
          isPinkBadge: action.payload.data?.isPinkBadge ?? false,
          avatar: action.payload.data?.avatar ?? null,
          username: action.payload.data?.username ?? '',
          email: action.payload.data?.email ?? '',
          fullName: action.payload.data?.fullName ?? null,
          gender: action.payload.data?.gender ?? null,
          dateOfBirth: action.payload.data?.dateOfBirth ?? null,
          country: action.payload.data?.country ?? null,
          state: action.payload.data?.state ?? null,
          city: action.payload.data?.city ?? null,
          role: action.payload.data?.role ?? 'user'
        };

        // Lưu thông tin người dùng vào bộ nhớ và state
        webStorageClient.setUserInfo(userInfo);
        state.userInfo = userInfo;
      }
    );
  }
});

export const { actionLogin } = authSlice.actions;

export default authSlice.reducer;
