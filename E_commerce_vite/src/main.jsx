import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Cart from "./components/Cart.jsx";
import AdminPage from "./components/AdminPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Login from "./components/Login.jsx";
import Orders from "./components/Orders.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import TopProducts from "./components/TopProducts.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster />
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<App />} />

      <Route
        path="/cart"
        element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="grow">
              <Cart />
            </div>
            <Footer />
          </div>
        }
      />

      <Route
        path="/products"
        element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="grow">
              <ProductDetail />
            </div>
            <Footer />
          </div>
        }
      />

      <Route
        path="/top-products"
        element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="grow">
              <TopProducts />
            </div>
            <Footer />
          </div>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="grow">
                <Orders />
              </div>
              <Footer />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
