import { Routes, Route, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import AppContext from "./components/AppContext";
import fetchApi from "./service/api";
export const api = "http://localhost:3000";

import HomeUser from "./pages/HomeUser";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Password from "./pages/Password";
import Confirm from "./pages/Confirm";
import DetailProduct from "./pages/DetailProduct";
import Cart from "./pages/Cart";
import User from "./pages/User";
import ChatBot from "./components/ChatBot";
import MyProfile from "./pages/MyProfile";
import MyOrder from "./pages/MyOrder";
import MyOrderDetail from "./pages/MyOrderDetail";
import AccessDeniedPage from "./pages/AccessDeniedPage";

import HomeAdmin from "./pages/HomeAdmin";
import Dashboard from "./pages/Dashboard";
import BrandManager from "./pages/BrandManager";
import CategoryManager from "./pages/CategoryManager";
import ProductManager from "./pages/ProductManager";
import UserManager from "./pages/UserManager";
import OrderManager from "./pages/OrderManager";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [me, setMe] = useState(null);
  const isAdmin = !isLoading && isLogin && me?.roles === "admin";
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

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
      .then(({ result }) => {
        setMe(result);
        setIsLogin(true);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLogin(false);
        setMe(null);
      });
  }, [refresh, isLoading, searchParams, setSearchParams]);
  useEffect(() => {
    fetchApi({ url: `${api}/product`, setData: setProducts });
  }, [refresh]);
  useEffect(() => {
    fetchApi({ url: `${api}/brand?_limit=10`, setData: setBrands });
  }, [refresh]);
  useEffect(() => {
    fetchApi({ url: `${api}/category`, setData: setCategories });
  }, [refresh]);
  useEffect(() => {
    fetchApi({ url: `${api}/user`, setData: setUsers });
  }, [refresh]);
  useEffect(() => {
    fetchApi({ url: `${api}/order`, setData: setOrders });
  }, [refresh]);

  return (
    <AppContext.Provider
      value={{
        refresh,
        setRefresh,
        isLoading,
        isLogin,
        setIsLogin,
        me,
        setMe,
        isAdmin,
        products,
        brands,
        setBrands,
        categories,
        users,
        setUsers,
        orders,
        setOrders,
        token,
      }}
    >
      <Routes>
        {/* Routes cho phía User */}
        <Route path="/users" element={<User />} />
        <Route
          path="/"
          element={
            <>
              <HomeUser />
              <ChatBot />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password" element={<Password />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="product/detail" element={<DetailProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-orders" element={<MyOrder />} />
        <Route path="/my-orders/detail" element={<MyOrderDetail />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        <Route path="/admin" element={<HomeAdmin />}>
          <Route path="" element={<Dashboard />} />
          <Route path="brands" element={<BrandManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="orders" element={<OrderManager />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        style={{ zIndex: 9999 }}
      />
    </AppContext.Provider>
  );
}

export default App;
