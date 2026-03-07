import "../style/Cart.css";
import { useContext } from "react";
import AppContext from "../components/AppContext";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

export default function Wishlist() {
  const { isLogin } = useContext(AppContext);

  // Mock wishlist data
  const wishlistItems = [];

  if (!isLogin) {
    return (
      <>
        <Navbar />
        <div className="wishlist-page">
          <div className="wishlist-container">
            <div className="not-logged-in">
              <h2>Bạn cần đăng nhập</h2>
              <p>Vui lòng đăng nhập để xem danh sách yêu thích của bạn</p>
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

  return (
    <>
      <Navbar />
      <div className="wishlist-page">
        <div className="wishlist-container">
          <h1>Danh Sách Yêu Thích</h1>

          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-icon">❤️</div>
              <h2>Danh sách yêu thích của bạn trống</h2>
              <p>
                Thêm các sản phẩm mà bạn yêu thích để dễ dàng tìm thấy chúng sau
                này
              </p>
              <a href="/" className="continue-shopping-btn">
                Tiếp Tục Mua Sắm
              </a>
            </div>
          ) : (
            <div className="wishlist-items">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="price">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </p>
                    <button className="add-to-cart-btn">
                      Thêm Vào Giỏ Hàng
                    </button>
                  </div>
                  <button className="remove-btn">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
