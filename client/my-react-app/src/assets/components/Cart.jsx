import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import AppContext from "./AppContext";
import React from "react";
import Navbar from "./UserNavbar";
import Footer from "./Footer";
import "../style/Cart.css";
import fetchApi from "../../service/api";
import { api } from "../../App";

export default function Cart() {
  const { isLoading, isLogin, me, refresh, setRefresh } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [myCart, setMyCart] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (!isLoading) {
      if (!isLogin) {
        navigate("/");
        return;
      }
    }
  }, [isLoading, isLogin, navigate]);

  useEffect(() => {
    if (me) {
      fetchApi({ url: `${api}/cart?userId=${me?._id}`, setData: setMyCart });
    }
  }, [me]);

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <header className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1>Giỏ hàng của bạn</h1>
        </header>

        <div className="cart-content">
          <ul className="cart-items">
            {myCart?.items.length > 0 ? (
              myCart?.items.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.productId.image} />
                  <div className="item-info">
                    <p className="item-name">{item.productId.productName}</p>
                    <p className="item-price">
                      {item.productId.price.toLocaleString()}đ
                    </p>
                    <p className="item-desc">{item.productId.description}</p>
                    <p className="item-tech">{item.productId.techSpecs}</p>
                    <div className="quantity-control">
                      <button>-</button>
                      <span>{item.quantity}</span>
                      <button>+</button>
                    </div>
                  </div>
                  <button className="remove">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </li>
              ))
            ) : (
              <p>Không có sản phẩm để hiển thị</p>
            )}
          </ul>

          <div className="cart-summary">
            <button className="checkout-btn">Mua ngay </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
