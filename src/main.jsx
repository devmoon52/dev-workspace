import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Router from "../src/routes/Router";
import Global from "./routes/Global.jsx";

import { HelmetProvider } from "react-helmet-async";

import { Provider } from "react-redux";
import { store } from "../src/redux/store.js";

import "@fontsource/inter";
import "@fontsource/sora";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <Provider store={store}>
      <Global />
      <Router />
    </Provider>
  </HelmetProvider>,
);
