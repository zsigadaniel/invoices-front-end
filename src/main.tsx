import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Invoices from "./pages/Invoices.tsx";
import SignIn from "./pages/SignIn.tsx";
  {
    path: "/invoices",
    element: <Invoices />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
