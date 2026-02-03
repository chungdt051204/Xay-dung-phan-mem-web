import { useContext, useState, useRef, useEffect } from "react";
import AppContext from "./AppContext";
import "../style/Navbar.css";
import logo from "../../assets/Logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isLogin, me } = useContext(AppContext);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const menuRef = useRef(null);

  // click ngoài thì đóng menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />

        <div className="navbar-category-wrapper">
          <button className="navbar-category">
            <i className="fa-solid fa-bars"></i>
            <span>Danh mục</span>
          </button>

          <ul className="category-dropdown">
            <li>📱 Điện thoại</li>
            <li>💻 Laptop</li>
            <li>🎧 Phụ kiện</li>
            <li>📺 Tivi</li>
          </ul>
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
          <div className="user-menu-wrapper" ref={menuRef}>
            <img
              src={me.avatar}
              alt="avatar"
              className="user-avatar"
              referrerPolicy="no-referrer"
              onClick={() => setOpenUserMenu(!openUserMenu)}
            />

            {openUserMenu && (
              <ul className="user-dropdown">
                <li>
                  <Link to="/profile"><i className="fa-regular fa-user"></i> Thông tin cá nhân</Link>
                </li>
                <li>
                  <Link to="/notifications"><i className="fa-regular fa-bell"></i> Thông báo</Link>
                </li>
                <li>
                  <Link to="/orders"><i className="fa-solid fa-box"></i> Đơn hàng của tôi</Link>
                </li>
                <li className="logout"><i className="fa-solid fa-right-from-bracket"></i> Đăng xuất</li>
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
