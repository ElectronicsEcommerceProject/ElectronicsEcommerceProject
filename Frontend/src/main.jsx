import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // ✅ Add this line
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Wrap App inside this */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
