import { useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import AppContext from "./AppContext";
import logo from "../../assets/Logo.png";
import "../style/Admin.css";

export default function AdminLayout() {
  const { me } = useContext(AppContext);
  const location = useLocation();

  function isActive(path) {
    return location.pathname === path ? "active" : "";
  }

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="brand-logo-wrapper">
          <Link to="/">
            <img src={logo} alt="Nhóm 4 Logo" className="brand-logo-img" />
          </Link>
        </div>

        <div className="admin-profile-card">
          <img
            src={me?.avatar || "https://ui-avatars.com/api/?name=Admin"}
            alt="avatar"
            referrerPolicy="no-referrer"
          />
          <div className="profile-info">
            <p className="profile-name">{me?.name || "Admin"}</p>
            <p className="profile-role">Quản trị viên</p>
          </div>
        </div>

        <nav className="admin-nav">
          <p className="nav-label">QUẢN TRỊ</p>

          <Link to="/admin" className={isActive("/admin")}>
            <i className="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/brands" className={isActive("/admin/brands")}>
            <i className="fa-solid fa-tags"></i>
            <span>Thương hiệu</span>
          </Link>

          <Link to="/admin/categories" className={isActive("/admin/categories")}>
            <i className="fa-solid fa-layer-group"></i>
            <span>Loại sản phẩm</span>
          </Link>

          <Link to="/admin/products" className={isActive("/admin/products")}>
            <i className="fa-solid fa-box-open"></i>
            <span>Sản phẩm</span>
          </Link>

          <Link to="/admin/users" className={isActive("/admin/users")}>
            <i className="fa-solid fa-users-gear"></i>
            <span>Người dùng</span>
          </Link>

          <Link to="/admin/orders" className={isActive("/admin/orders")}>
            <i className="fa-solid fa-cart-flatbed"></i>
            <span>Đơn hàng</span>
          </Link>

          <div className="admin-nav-bottom">
            <div className="nav-divider"></div>
            <Link to="/" className="back-to-home">
              <i className="fa-solid fa-house"></i>
              <span>Về trang chủ</span>
            </Link>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Tìm kiếm hệ thống..." />
          </div>

          <div className="admin-header-right">
            <div className="icon-badge">
              <i className="fa-regular fa-bell"></i>
              <span className="dot"></span>
            </div>
            <img
              src={me?.avatar || "https://ui-avatars.com/api/?name=Admin"}
              alt="avatar"
              className="header-mini-avatar"
            />
          </div>
        </header>

        <section className="admin-page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
