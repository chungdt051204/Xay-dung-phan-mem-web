import "../style/Account.css";
import { useContext, useState } from "react";
import AppContext from "../components/AppContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

export default function Account() {
  const { isLogin, me, setIsLogin } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  if (!isLogin) {
    return (
      <>
        <Navbar />
        <div className="account-page">
          <div className="account-container">
            <div className="not-logged-in">
              <h2>Bạn chưa đăng nhập</h2>
              <p>Vui lòng đăng nhập để xem thông tin tài khoản của bạn</p>
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="account-page">
        <div className="account-container">
          <div className="account-header">
            <h1>Tài Khoản Của Tôi</h1>
          </div>

          <div className="account-content">
            <aside className="account-sidebar">
              <div className="user-profile">
                <div className="user-avatar">
                  {me?.name?.charAt(0).toUpperCase()}
                </div>
                <h3>{me?.name}</h3>
                <p>{me?.email}</p>
              </div>

              <nav className="account-menu">
                <button
                  className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  👤 Hồ Sơ
                </button>
                <button
                  className={`menu-item ${activeTab === "orders" ? "active" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  📦 Đơn Hàng
                </button>
                <button
                  className={`menu-item ${activeTab === "addresses" ? "active" : ""}`}
                  onClick={() => setActiveTab("addresses")}
                >
                  📍 Địa Chỉ
                </button>
                <button
                  className={`menu-item ${activeTab === "settings" ? "active" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  ⚙️ Cài Đặt
                </button>
                <button className="menu-item logout-btn" onClick={handleLogout}>
                  🚪 Đăng Xuất
                </button>
              </nav>
            </aside>

            <main className="account-main">
              {activeTab === "profile" && (
                <section className="account-section">
                  <h2>Thông Tin Cá Nhân</h2>
                  <div className="profile-form">
                    <div className="form-group">
                      <label>Họ và Tên</label>
                      <input type="text" value={me?.name || ""} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" value={me?.email || ""} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Loại Tài Khoản</label>
                      <input
                        type="text"
                        value={
                          me?.roles === "admin" ? "Quản Trị Viên" : "Khách Hàng"
                        }
                        readOnly
                      />
                    </div>
                    <button className="edit-btn">Chỉnh Sửa Thông Tin</button>
                  </div>
                </section>
              )}

              {activeTab === "orders" && (
                <section className="account-section">
                  <h2>Đơn Hàng Của Tôi</h2>
                  <div className="orders-list">
                    <p>
                      Bạn có thể xem danh sách đơn hàng tại{" "}
                      <a href="/orders">trang Đơn Hàng</a>
                    </p>
                  </div>
                </section>
              )}

              {activeTab === "addresses" && (
                <section className="account-section">
                  <h2>Địa Chỉ Giao Hàng</h2>
                  <div className="addresses-list">
                    <p>Chưa có địa chỉ nào. Hãy thêm một địa chỉ mới.</p>
                    <button className="add-btn">Thêm Địa Chỉ Mới</button>
                  </div>
                </section>
              )}

              {activeTab === "settings" && (
                <section className="account-section">
                  <h2>Cài Đặt</h2>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Thay Đổi Mật Khẩu</label>
                      <button className="change-password-btn">
                        <a href="/password">Đổi Mật Khẩu</a>
                      </button>
                    </div>
                    <div className="form-group">
                      <label>Nhận Thông Báo</label>
                      <input
                        type="checkbox"
                        id="notifications"
                        defaultChecked
                      />
                      <label htmlFor="notifications" className="checkbox-label">
                        Tôi muốn nhận email thông báo về các đơn hàng
                      </label>
                    </div>
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
