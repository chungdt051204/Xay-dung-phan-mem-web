import { useContext, useState, useRef, useEffect } from "react";
import AppContext from "./AppContext";
import "../style/Navbar.css";
import logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../App";
import fetchApi from "../../service/api";

export default function UserNavbar() {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, setRefresh, me, products } =
    useContext(AppContext);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim().length > 0) {
      // Fetch suggestions from backend instead of client-side filtering
      const params = new URLSearchParams();
      params.append("productName", value);
      params.append("_limit", 8);

      fetchApi({
        url: `${api}/product?${params.toString()}`,
        setData: (data) => {
          if (data?.docs && data.docs.length > 0) {
            setSuggestions(data.docs);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        },
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId, productName) => {
    navigate(`/product/detail?productId=${productId}`);
    setSearchInput("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

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

      <div className="navbar-search" ref={searchRef}>
        <form onSubmit={handleSearch}>
          <i
            className="fa-solid fa-magnifying-glass"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
            title="Tìm kiếm"
          ></i>
          <input
            className="search"
            type="text"
            placeholder="Bạn muốn mua gì hôm nay?"
            value={searchInput}
            onChange={handleInputChange}
          />
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            <ul className="suggestions-list">
              {suggestions.map((product) => (
                <li key={product._id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestionClick(product._id, product.productName)
                    }
                    className="suggestion-item"
                  >
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="suggestion-image"
                    />
                    <div className="suggestion-content">
                      <span className="suggestion-name">
                        {product.productName}
                      </span>
                      <span className="suggestion-price">
                        {product.price?.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
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
