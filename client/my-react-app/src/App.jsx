import { Routes, Route, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import AppContext from "./assets/components/AppContext";
import HomeUser from "./assets/pages/HomeUser";
import Login from "./assets/pages/Login";
import Register from "./assets/pages/Register";
import HomeAdmin from "./assets/pages/HomeAdmin";
import BrandManager from "./assets/pages/BrandManager";
import CategoryManager from "./assets/pages/CategoryManager";
import ProductManager from "./assets/pages/ProductManager";
import UserManager from "./assets/pages/UserManager";
import OrderManager from "./assets/pages/OrderManager";
import Password from "./assets/pages/Password";
import Confirm from "./assets/pages/Confirm";
import DetailProduct from "./assets/pages/DetailProduct";
import Cart from "./assets/pages/Cart"; // cart page/component
import fetchApi from "./service/api";
import AccessDeniedPage from "./assets/pages/AccessDeniedPage";
import MyOrder from "./assets/pages/MyOrder";
import MyOrderDetail from "./assets/pages/MyOrderDetail";
import About from "./assets/pages/About";
import Blogs from "./assets/pages/Blogs";
import Contact from "./assets/pages/Contact";
import FAQ from "./assets/pages/FAQ";
import Account from "./assets/pages/Account";
import Checkout from "./assets/pages/Checkout";
import Wishlist from "./assets/pages/Wishlist";
import Orders from "./assets/pages/Orders";
import User from "./assets/pages/User";
import ChatBot from "./assets/components/ChatBot";

export const api = "http://localhost:3000";

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
        <Route path="/my-orders" element={<MyOrder />} />
        <Route path="/my-orders/detail" element={<MyOrderDetail />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        {/* Quick Links & Account Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/account" element={<Account />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        {/* Routes cho phía Admin  */}
        <Route path="/admin" element={<HomeAdmin />}>
          <Route path="brands" element={<BrandManager />} />{" "}
          <Route path="categories" element={<CategoryManager />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="orders" element={<OrderManager />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={1000} />
    </AppContext.Provider>
  );
}

export default App;
