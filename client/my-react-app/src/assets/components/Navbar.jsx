import { useContext, useState } from "react";
import AppContext from "./AppContext";
import "../style/Navbar.css";
import logo from "../../assets/Logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isLogin, me } = useContext(AppContext);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>

        <div
          className="navbar-category-wrapper"
          onMouseEnter={() => setOpenCategoryMenu(true)}
          onMouseLeave={() => setOpenCategoryMenu(false)}
        >
          <button className="navbar-category">
            <i className="fa-solid fa-bars"></i>
            <span>Danh mục</span>
          </button>

          {openCategoryMenu && (
            <ul className="category-dropdown">
              <li>📱 Điện thoại</li>
              <li>💻 Laptop</li>
              <li>🎧 Phụ kiện</li>
              <li>📺 Tivi</li>
            </ul>
          )}
        </div>
      </div>

      <div className="navbar-search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          className="search"
          type="text"
          placeholder="Bạn muốn mua gì hôm nay?"
        />
      </div>

      <div className="navbar-right">
        <div className="navbar-item">
          <i className="fa-solid fa-cart-shopping"></i>
          <span>Giỏ hàng</span>
        </div>
        {isLogin && me ? (
          <div
            className="user-menu-wrapper"
            onMouseEnter={() => setOpenUserMenu(true)}
            onMouseLeave={() => setOpenUserMenu(false)}
          >
            <img
              src={me.avatar}
              alt="avatar"
              className="user-avatar"
              referrerPolicy="no-referrer"
            />

            {openUserMenu && (
              <ul className="user-dropdown">
                <li>
                  <Link to="/profile">
                    <i className="fa-regular fa-user"></i> Thông tin cá nhân
                  </Link>
                </li>
                <li>
                  <Link to="/notifications">
                    <i className="fa-regular fa-bell"></i> Thông báo
                  </Link>
                </li>
                <li>
                  <Link to="/orders">
                    <i className="fa-solid fa-box"></i> Đơn hàng của tôi
                  </Link>
                </li>
                <li className="logout">
                  <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="navbar-item login">
            <i className="fa-regular fa-user"></i>
            <Link to="/login">
              <span>Đăng nhập</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
