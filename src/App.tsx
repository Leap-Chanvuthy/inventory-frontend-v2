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
import { CreateCategories } from "./pages/category/raw-material-category/create/page";
import { EditCategories } from "./pages/category/raw-material-category/update/page";
import { ViewCategories } from "./pages/category/raw-material-category/view/page";
import { ProductCategories } from "./pages/category/product-category/page";
import { CreateProductCategories } from "./pages/category/product-category/create/page";
import { EditProductCategories } from "./pages/category/product-category/update/page";
import { ViewProductCategories } from "./pages/category/product-category/view/page";
import { CreateCustomerCategories } from "./pages/category/customer-category/create/page";
import { EditCustomerCategories } from "./pages/category/customer-category/edit/page";
import { ViewCustomerCategories } from "./pages/category/customer-category/view/page";
import { Supplier } from "./pages/supplier/page";
import CreateSupplier from "./pages/supplier/create/page";
import UpdateSupplier from "./pages/supplier/update/page";
import { SupplierDetail } from "./pages/supplier/view/page";
import ImportSuppliers from "./pages/supplier/import/page";
import ImportHistory from "./pages/supplier/import-history/page";
import Profile from "./pages/profile/page";
import UOM from "./pages/uom/page";
import CreateUOM from "./pages/uom/create/page";
import ViewUOM from "./pages/uom/view/page";
import EditUOM from "./pages/uom/edit/page";

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
              <Route path="/profile" element={<Profile />} />
              <Route path="/products" element={<Product />} />

              {/* ADMIN ONLY */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                {/* User Routes */}
                <Route path="/users" element={<Users />} />
                <Route path="/users/create" element={<CreateUser />} />
                <Route path="/users/update/:id" element={<UpdateUser />} />

                {/* Supplier */}
                <Route path="/supplier" element={<Supplier />} />
                <Route path="/supplier/create" element={<CreateSupplier />} />
                <Route path="/supplier/import" element={<ImportSuppliers />} />
                <Route
                  path="/supplier/import-history"
                  element={<ImportHistory />}
                />
                <Route
                  path="/supplier/update/:id"
                  element={<UpdateSupplier />}
                />
                <Route path="/supplier/view/:id" element={<SupplierDetail />} />

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
                <Route
                  path="/categories/create"
                  element={<CreateCategories />}
                />
                <Route
                  path="/categories/view/:id"
                  element={<ViewCategories />}
                />
                <Route
                  path="/categories/edit/:id"
                  element={<EditCategories />}
                />

                {/* Product Categories */}
                <Route
                  path="/product-categories"
                  element={<ProductCategories />}
                />
                <Route
                  path="/product-categories/create"
                  element={<CreateProductCategories />}
                />
                <Route
                  path="/product-categories/view/:id"
                  element={<ViewProductCategories />}
                />
                <Route
                  path="/product-categories/edit/:id"
                  element={<EditProductCategories />}
                />

                {/* Customer Categories */}
                <Route
                  path="/customer-categories/create"
                  element={<CreateCustomerCategories />}
                />
                <Route
                  path="/customer-categories/view/:id"
                  element={<ViewCustomerCategories />}
                />
                <Route
                  path="/customer-categories/edit/:id"
                  element={<EditCustomerCategories />}
                />

                <Route path="/unit-of-measurement" element={<UOM />} />
                <Route path="/uom/create" element={<CreateUOM />} />
                <Route path="/uom/view/:id" element={<ViewUOM />} />
                <Route path="/uom/edit/:id" element={<EditUOM />} />

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
