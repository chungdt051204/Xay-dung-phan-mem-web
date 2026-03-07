import "../style/Contact.css";
import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ trả lời sớm nhất.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <>
      <Navbar />
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-hero">
            <h1>Liên Hệ Với Chúng Tôi</h1>
            <p className="hero-subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          </div>

          <div className="contact-content">
            <div className="contact-info-section">
              <h2>Thông Tin Liên Hệ</h2>
              <div className="info-grid">
                <div className="info-item">
                  <h3>📧 Email</h3>
                  <p>
                    <a href="mailto:support@nhom4.com">support@nhom4.com</a>
                  </p>
                </div>
                <div className="info-item">
                  <h3>📱 Điện Thoại</h3>
                  <p>
                    <a href="tel:1900-1234">1900-1234</a>
                  </p>
                </div>
                <div className="info-item">
                  <h3>📍 Địa Chỉ</h3>
                  <p>123 Đường ABC, Phường XYZ, Thành phố Hồ Chí Minh</p>
                </div>
                <div className="info-item">
                  <h3>⏰ Giờ Làm Việc</h3>
                  <p>Thứ 2 - Chủ Nhật: 8:00 - 20:00</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Gửi Tin Nhắn</h2>

              <div className="form-group">
                <label htmlFor="name">Họ Tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên của bạn"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Nhập email của bạn"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Điện Thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Chủ Đề *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Nhập chủ đề"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Nội Dung *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Nhập nội dung tin nhắn của bạn"
                  rows="6"
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Gửi Tin Nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
