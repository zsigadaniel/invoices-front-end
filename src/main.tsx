import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import SignIn from "./pages/SignIn.tsx";
  {
    path: "/signin",
    element: <SignIn />,
  },

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
