import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./components/layout/layout";
import Login from "./pages/auth/login";
import NotFound from "./components/layout/404";
import Forbidden from "./components/layout/403";
import ProtectedRoute from "./components/routes/protected-route";
import UnauthicatedRoute from "./components/routes/unauthenticated-route";
import Home from "./pages/home/page";
import Product from "./pages/products/page";
import Users from "./pages/users/page";
import CreateUser from "./pages/users/create/page";
import Setting from "./pages/settings/page";
import Company from "./pages/company/page";
import { ROLES } from "./consts/role";
import UpdateUser from "./pages/users/update/page";
import Warehouses from "./pages/warehouses/page";
import ViewWarehouses from "./pages/warehouses/view/page";
import UpdateWarehouse from "./pages/warehouses/update/page";
import CreateWarehouses from "./pages/warehouses/create/page";
import VerifyEmail from "./pages/auth/verify-email";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import Categories from "./pages/category/page";
import { CreateCategories } from "./pages/category/create/page";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          {/* Unauthenticated Routes */}
          <Route element={<UnauthicatedRoute />}>
            <Route path="/auth/login" element={<Login />} />
          </Route>

          {/* Protected Routes (Authenticated Users) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Product />} />

              {/* ADMIN ONLY */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>

                {/* User Routes */}
                <Route path="/users" element={<Users />} />
                <Route path="/users/create" element={<CreateUser />} />
                <Route path="/users/update/:id" element={<UpdateUser />} />

                {/* Warehouse Routes */}
                <Route path="/warehouses" element={<Warehouses />} />
                <Route
                  path="/warehouses/view/:id"
                  element={<ViewWarehouses />}
                />
                <Route
                  path="/warehouses/update/:id"
                  element={<UpdateWarehouse />}
                />
                <Route
                  path="/warehouses/create"
                  element={<CreateWarehouses />}
                />

                {/* Categories */}
                <Route path="/categories" element={<Categories />} />



                {/* Company Settings */}                
                <Route path="/company" element={<Company />} />
                <Route path="/settings" element={<Setting />} />

              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
