import { useContext } from "react";
import AppContext from "./AppContext";
import "../style/Navbar.css";
import logo from "../../assets/Logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isLogin, me } = useContext(AppContext);
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />

        <button className="navbar-category">
          <i className="fa-solid fa-bars"></i>
          <span>Danh mục</span>
        </button>
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
        {isLogin && me !== null ? (
          <div>
            <img
              src={me.avatar}
              alt=""
              referrerPolicy="no-referrer"
              width={30}
              height={30}
            />
            <button>Đăng xuất</button>
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
