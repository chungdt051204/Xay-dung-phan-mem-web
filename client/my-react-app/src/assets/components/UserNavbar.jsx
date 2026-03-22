import { useContext, useState, useRef, useEffect } from "react";
import AppContext from "./AppContext";
import "../style/Navbar.css";
import logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserNavbar() {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, setRefresh, me } = useContext(AppContext);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);

  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    toast.success("Đăng xuất thành công");
    setRefresh((prev) => prev + 1);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>

        <div className="navbar-category-wrapper">
          <button
            className="navbar-category"
            onClick={() => setOpenCategoryMenu((prev) => !prev)}
          >
            <i className="fa-solid fa-bars"></i>
            <span>Danh mục</span>
          </button>

          {openCategoryMenu && (
            <ul className="category-dropdown">
              <li
                onClick={() => {
                  navigate("/?category=phone");
                  setOpenCategoryMenu(false);
                }}
              >
                📱 Điện thoại
              </li>
              <li
                onClick={() => {
                  navigate("/?category=laptop");
                  setOpenCategoryMenu(false);
                }}
              >
                💻 Laptop
              </li>
              <li
                onClick={() => {
                  navigate("/?category=tablet");
                  setOpenCategoryMenu(false);
                }}
              >
                ⌚ Máy tính bảng
              </li>
              <li
                onClick={() => {
                  navigate("/?category=headphone");
                  setOpenCategoryMenu(false);
                }}
              >
                🎧 Headphone
              </li>
              <li
                onClick={() => {
                  navigate("/?category=tivi");
                  setOpenCategoryMenu(false);
                }}
              >
                📺 Tivi
              </li>
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
        <div
          onClick={() => {
            if (!isLogin) {
              toast.warning("Bạn chưa đăng nhập");
              return;
            }
            navigate("/cart");
          }}
          className="navbar-item cart-link"
        >
          <i className="fa-solid fa-cart-shopping"></i>
          <span>Giỏ hàng</span>
        </div>

        {isLogin && me ? (
          <div className="user-menu-wrapper" ref={userMenuRef}>
            <img
              src={me.avatar}
              alt="avatar"
              style={{ borderRadius: "50%" }}
              width={50}
              height={50}
              referrerPolicy="no-referrer"
              onClick={() => setOpenUserMenu((prev) => !prev)}
            />

            {openUserMenu && (
              <ul className="user-dropdown">
                <li>
                  <Link to="/my-profile" onClick={() => setOpenUserMenu(false)}>
                    <i className="fa-regular fa-user"></i> Thông tin cá nhân
                  </Link>
                </li>

                <li>
                  <Link
                    to="/notifications"
                    onClick={() => setOpenUserMenu(false)}
                  >
                    <i className="fa-regular fa-bell"></i> Thông báo
                  </Link>
                </li>

                <li>
                  <Link to="/my-orders" onClick={() => setOpenUserMenu(false)}>
                    <i className="fa-solid fa-box"></i> Đơn hàng của tôi
                  </Link>
                </li>

                {me.roles === "admin" && (
                  <li>
                    <Link to="/admin" onClick={() => setOpenUserMenu(false)}>
                      <i className="fa-solid fa-user-shield"></i> Admin
                      Dashboard
                    </Link>
                  </li>
                )}

                <li onClick={handleLogout} className="logout">
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
