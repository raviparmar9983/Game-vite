import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  _id: string;
  userName: string;
  email: string;
  coins: number;
}

const initialState: UserState = {
  _id: "",
  userName: "",
  email: "",
  coins: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
