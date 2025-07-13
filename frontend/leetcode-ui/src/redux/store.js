// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "redux";

import codeReducer from "./slices/codeSlice";

const rootReducer = combineReducers({
  code: codeReducer,
  // you can add more slices like auth, theme, etc
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["code"], // only persist this
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
