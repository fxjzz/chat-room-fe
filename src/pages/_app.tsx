import "@/styles/globals.css";
import { configureStore } from "@reduxjs/toolkit";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import usernameReducer from "../store/store";

const store = configureStore({
  reducer: {
    username: usernameReducer,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

