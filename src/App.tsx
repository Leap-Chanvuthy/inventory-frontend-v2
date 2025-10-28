import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/products/page";
import Home from "./pages/home/page";
import Layout from "./components/layout/layout";
import { Login } from "./pages/auth/login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}