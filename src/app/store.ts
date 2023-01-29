import { configureStore } from "@reduxjs/toolkit";

import openOrdersReducer from "../features/openOrderSlice";

const store = configureStore({
  reducer: {
    openOrders: openOrdersReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
