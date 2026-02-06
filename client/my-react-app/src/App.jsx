import { Routes, Route, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import AppContext from "./assets/components/AppContext";
import HomeUser from "./assets/components/HomeUser";
import Login from "./assets/components/Login";
import Register from "./assets/components/Register";

// Import Layout và các trang Admin (Bạn hãy tạo các file này nhé)
import AdminLayout from "./assets/components/AdminLayout";
import Dashboard from "./assets/pages/Dashboard";
import BrandManager from "./assets/pages/BrandManager";
import CategoryManager from "./assets/pages/CategoryManager";
import ProductManager from "./assets/pages/ProductManager";
import UserManager from "./assets/pages/UserManager";
import OrderManager from "./assets/pages/OrderManager";

export const api = "http://localhost:3000";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refresh, setRefresh] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setSearchParams((prev) => {
        prev.delete("token");
        return prev;
      });
    }

    if (!localStorage.token) return;

    fetch(`${api}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ data }) => {
        setMe(data);
        setIsLogin(true);
      })
      .catch(() => {
        setIsLogin(false);
        setMe(null);
      });
  }, [refresh, searchParams, setSearchParams]);

  return (
    <AppContext.Provider
      value={{ refresh, setRefresh, isLogin, setIsLogin, me, setMe }}
    >
      <Routes>
        {/* Routes cho phía User */}
        <Route path="/" element={<HomeUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes cho phía Admin Dashboard - Thêm /admin vào đầu */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />{" "}
          {/* Đường dẫn mặc định /admin */}
          <Route path="brands" element={<BrandManager />} />{" "}
          {/* /admin/brands */}
          <Route path="categories" element={<CategoryManager />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="orders" element={<OrderManager />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
