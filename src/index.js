import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StartRating from "./StartRating.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {
      <App />
      // <>
      //   <StartRating max={5} color="white" size={24} />
      //   <StartRating max={10} color="blue" size={50} />
      // </>
    }
  </React.StrictMode>
);
