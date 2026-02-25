import { useNavigate } from "react-router-dom";
import React from "react";
import Navbar from "./UserNavbar";
import Footer from "./Footer";
import "../style/Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  // placeholder data matching product schema from screenshot
  const items = [
    {
      id: "698c5c81c16a330cd5272b30",
      productName: "Samsung Galaxy S25 Ultra",
      price: 33990000, // stored as number
      description: "Galaxy S25 Ultra flagship cao cấp với camera đỉnh cao.",
      techSpecs: "Snapdragon 8 Gen 4, camera 200MP, RAM 12GB.",
      thumbnail: "https://res.cloudinary.com/dnwxuvei9/image/upload/v1770718248/dien-thoai.jpg",
      images: [],
      quantityStock: 50,
      status: "còn hàng",
      quantity: 1,
    },
    {
      id: "6997d1a3b27a44cda1f2b345",
      productName: "iPhone 17 Pro Max",
      price: 41990000,
      description: "Mẫu iPhone mới nhất với chip A18, camera 48MP.",
      techSpecs: "A18 Bionic, RAM 8GB, ROM 256GB.",
      thumbnail: "https://via.placeholder.com/80?text=iPhone",
      images: [],
      quantityStock: 30,
      status: "còn hàng",
      quantity: 2,
    },
    {
      id: "69a0f2c4e98b24cba2d90abc",
      productName: "Xiaomi Redmi Note 15",
      price: 7990000,
      description: "Điện thoại tầm trung pin khủng 6000mAh.",
      techSpecs: "Snapdragon 7 Gen 2, RAM 6GB, ROM 128GB.",
      thumbnail: "https://via.placeholder.com/80?text=Redmi",
      images: [],
      quantityStock: 100,
      status: "còn hàng",
      quantity: 1,
    },
  ];

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
        <button className="cart-tab active">Giỏ hàng</button>
        <ul className="cart-items">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.thumbnail} alt={item.productName} />
              <div className="item-info">
                <p className="item-name">{item.productName}</p>
                <p className="item-price">{item.price.toLocaleString()}đ</p>
                <p className="item-desc">{item.description}</p>
                <p className="item-tech">{item.techSpecs}</p>
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
          ))}
        </ul>

        <div className="cart-summary">
          <p>
            Tạm tính: <span>{items.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}đ</span>
          </p>
          <button className="checkout-btn">Mua ngay ({items.length})</button>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
}
