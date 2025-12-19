import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/products/page";
import Home from "./pages/home/page";
import Layout from "./components/layout/layout";
import Login from "./pages/auth/login";
import Setting from "./pages/settings/page";
import Company from "./pages/settings/company/page";
import NotFound from "./components/layout/404";
import Users from "./pages/users/page";
import CreateUser from "./pages/users/create/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />


          {/* Users Group Route */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/create" element={<CreateUser />} />

          {/* Setting Group Route */}
          <Route path="/settings" element={<Setting />} />
          <Route path="/company-info" element={<Company />} />

        </Route>
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  )
}