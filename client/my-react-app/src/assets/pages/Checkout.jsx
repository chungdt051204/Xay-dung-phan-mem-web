import "../style/Cart.css";
import { useContext } from "react";
import AppContext from "../components/AppContext";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

export default function Checkout() {
  const { isLogin } = useContext(AppContext);

  if (!isLogin) {
    return (
      <>
        <Navbar />
        <div className="checkout-page">
          <div className="checkout-container">
            <div className="not-logged-in">
              <h2>Bạn cần đăng nhập để thanh toán</h2>
              <p>Vui lòng đăng nhập để hoàn tất quá trình thanh toán</p>
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
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>Thanh Toán</h1>

          <div className="checkout-content">
            <section className="checkout-section">
              <h2>Bước 1: Kiểm Tra Giỏ Hàng</h2>
              <p>
                Vui lòng truy cập <a href="/cart">trang Giỏ Hàng</a> để kiểm tra
                lại các sản phẩm của bạn.
              </p>
            </section>

            <section className="checkout-section">
              <h2>Bước 2: Xác Nhận Địa Đỉa</h2>
              <form className="checkout-form">
                <div className="form-group">
                  <label>Họ và Tên *</label>
                  <input type="text" placeholder="Nhập họ tên" required />
                </div>

                <div className="form-group">
                  <label>Địa Chỉ *</label>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ đầy đủ"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thành Phố *</label>
                    <input type="text" placeholder="Nhập thành phố" required />
                  </div>
                  <div className="form-group">
                    <label>Mã Bưu Chính *</label>
                    <input
                      type="text"
                      placeholder="Nhập mã bưu chính"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Điện Thoại *</label>
                  <input type="tel" placeholder="Nhập số điện thoại" required />
                </div>
              </form>
            </section>

            <section className="checkout-section">
              <h2>Bước 3: Chọn Phương Thức Thanh Toán</h2>
              <div className="payment-methods">
                <label className="payment-method">
                  <input type="radio" name="payment" defaultChecked />
                  <span>Credit Card (VISA, Mastercard)</span>
                </label>
                <label className="payment-method">
                  <input type="radio" name="payment" />
                  <span>PayPal</span>
                </label>
                <label className="payment-method">
                  <input type="radio" name="payment" />
                  <span>VNPAY</span>
                </label>
                <label className="payment-method">
                  <input type="radio" name="payment" />
                  <span>MoMo</span>
                </label>
                <label className="payment-method">
                  <input type="radio" name="payment" />
                  <span>Thanh Toán Khi Nhận Hàng</span>
                </label>
              </div>
            </section>

            <section className="checkout-section checkout-summary">
              <h2>Tóm Tắt Đơn Hàng</h2>
              <div className="summary-content">
                <p className="summary-item">
                  <span>Tạm Tính:</span>
                  <span>0 ₫</span>
                </p>
                <p className="summary-item">
                  <span>Phí Giao Hàng:</span>
                  <span>0 ₫</span>
                </p>
                <p className="summary-item total">
                  <span>Tổng Cộng:</span>
                  <span>0 ₫</span>
                </p>
              </div>
              <button className="checkout-btn">Hoàn Tất Thanh Toán</button>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
