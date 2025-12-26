import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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


export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/403" element={<Forbidden />} />
          
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


                <Route path="/settings" element={<Setting />} />
                <Route path="/company-info" element={<Company />} />
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
