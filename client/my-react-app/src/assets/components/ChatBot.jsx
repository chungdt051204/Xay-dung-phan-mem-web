import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "../style/ChatBot.css";

const WELCOME_MSG = {
  user: false,
  text: "Xin chào 👋 Tôi là trợ lý bán hàng.\nHãy thử hỏi:\n• Điện thoại iPhone\n• Samsung\n• Laptop\n• Tai nghe\n• TV",
  products: [],
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [text, setText] = useState("");

  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Cuộn xuống cuối tin nhắn khi có tin mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const userMsg = { user: true, text: text };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = text; // Giữ lại giá trị để gửi đi
    setText("");

    fetch("http://localhost:3000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: currentInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          {
            user: false,
            text: data.reply || "Tôi tìm thấy các sản phẩm sau:",
            products: data.products || [],
          },
        ]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          {
            user: false,
            text: "Chatbot đang bảo trì, vui lòng thử lại sau ⚠️",
            products: [],
          },
        ]);
      });
  };

  const openProduct = (id) => {
    navigate(`/product/detail?productId=${id}`);
    setOpen(false);
  };

  return createPortal(
    <>
      <div className="chatbot-icon" onClick={() => setOpen(!open)}>
        <i className="fa-solid fa-message"></i>
      </div>

      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>Trợ lý Nhóm 4</span>
            <div className="chatbot-actions">
              <button onClick={() => setMessages([WELCOME_MSG])}>↻</button>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.user ? "user" : "bot"}`}
              >
                <div className="chat-bubble">{msg.text}</div>
                {msg.products?.map((p) => (
                  <div
                    key={p._id}
                    className="chat-product"
                    onClick={() => openProduct(p._id)}
                  >
                    <img src={p.thumbnail} alt={p.productName} />
                    <div className="chat-product-info">
                      <p className="chat-product-name">{p.productName}</p>
                      <p className="chat-product-price">
                        {p.price.toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
