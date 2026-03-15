import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "../style/ChatBot.css";

export default function ChatBot() {

    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const chatEndRef = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    useEffect(() => {

        if (open && messages.length === 0) {
            const welcome = {
                user: false,
                text: "Xin chào 👋 Tôi là trợ lý bán hàng.\nBạn cần hỗ trợ gì?\n\nBạn có thể hỏi:\n• Điện thoại iPhone\n• Samsung\n• Laptop\n• Tai nghe\n• TV",
                products: []
            };
            setMessages([welcome]);
        }
    }, [open]);
    const sendMessage = async () => {
        if (text.trim() === "") return;
        const userMessage = {
            user: true,
            text: text
        };
        setMessages(prev => [...prev, userMessage]);
        try {
            const res = await fetch("http://localhost:3000/api/chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text
                })
            });
            const data = await res.json();
            const botReply = {
                user: false,
                text: data.reply || "Tôi đang tìm sản phẩm cho bạn...",
                products: data.products || []
            };
            setMessages(prev => [...prev, botReply]);
        } catch (error) {
            const botReply = {
                user: false,
                text: "Chatbot đang lỗi ⚠️",
                products: []
            };
            setMessages(prev => [...prev, botReply]);
        }
        setText("");
    };
    const refreshChat = () => {
        const welcome = {
            user: false,
            text: "Xin chào 👋 Tôi có thể giúp gì cho bạn?\n\nHãy thử hỏi:\n• Điện thoại Apple\n• Samsung\n• Laptop\n• Tai nghe\n• TV",
            products: []
        };
        setMessages([welcome]);
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
                        <span>Nhóm 4 hỗ trợ</span>
                        <div className="chatbot-actions">
                            <button onClick={refreshChat}>↻</button>
                            <button onClick={() => setOpen(false)}>X</button>

                        </div>
                    </div>
                    <div className="chatbot-body">
                        {messages.map((msg, index) => (

                            <div
                                key={index}
                                className={`chat-message ${msg.user ? "user" : "bot"}`}
                            >
                                <div className="chat-bubble">
                                    {msg.text}
                                </div>
                                {msg.products && msg.products.map(p => (
                                    <div
                                        key={p._id}
                                        className="chat-product"
                                        onClick={() => openProduct(p._id)}
                                    >
                                        <img
                                            src={p.thumbnail}
                                            alt={p.productName}
                                        />
                                        <div className="chat-product-info">
                                            <div className="chat-product-name">
                                                {p.productName}
                                            </div>
                                            <div className="chat-product-price">
                                                {p.price.toLocaleString()} đ
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>

                    <div className="chatbot-input">

                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />

                        <button onClick={sendMessage}>
                            Gửi
                        </button>

                    </div>

                </div>

            )}

        </>,
        document.body
    );

}