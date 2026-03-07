import { useContext } from "react";
import AppContext from "../components/AppContext";
import MyOrder from "./MyOrder";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

export default function Orders() {
  const { isLogin } = useContext(AppContext);

  if (!isLogin) {
    return (
      <>
        <Navbar />
        <div className="orders-page\">
          <div className="orders-container">
            <div className="not-logged-in">
              <h2>Bạn cần đăng nhập</h2>
              <p>Vui lòng đăng nhập để xem đơn hàng của bạn</p>
              <a href="/login" className="login-btn">
                Đăng Nhập
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Use the existing MyOrder component for orders page
  return (
    <>
      <Navbar />
      <MyOrder />
      <Footer />
    </>
  );
}
