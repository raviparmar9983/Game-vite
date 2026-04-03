import { configureStore } from "@reduxjs/toolkit";
import userReducer, { userSlice } from "./reducers/userReducer";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [userSlice.name]: userReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
