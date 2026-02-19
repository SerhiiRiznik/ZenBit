import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducers";

const ACCESS_TOKEN_KEY = "zenbit_access_token";

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

const storedToken = getStoredToken();

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    authorization: {
      status: "idle",
      error: null,
      token: storedToken,
    },
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

let previousToken = store.getState().authorization.token;

store.subscribe(() => {
  const currentToken = store.getState().authorization.token;

  if (currentToken === previousToken || typeof window === "undefined") {
    return;
  }

  previousToken = currentToken;

  if (currentToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, currentToken);
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
