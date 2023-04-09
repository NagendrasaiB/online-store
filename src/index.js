import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Shopping from "./components/Shopping";
import Favourites from "./components/Favourites";
import Cart from "./components/Cart";
import Product from "./components/Product";

const url = "https://20.83.190.91";

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login url={url} />} />
      <Route path="/shopping" element={<Shopping url={url} />} />
      <Route path="/shopping/:productId" element={<Product url={url} />} />
      <Route path="/cart" element={<Cart url={url} />} />
      <Route path="/favourites" element={<Favourites url={url} />} />
    </Routes>
  </Router>,

  document.getElementById("root")
);
