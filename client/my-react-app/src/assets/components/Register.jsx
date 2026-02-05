import "../style/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";

const API_URL = "http://localhost:3000/user";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "chưa chọn",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (
      !formData.fullname ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.phone ||
      !formData.dateOfBirth
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không trùng khớp");
      return false;
    }

    if (!isValidEmail(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    if (!isValidPhone(formData.phone)) {
      setError("Số điện thoại phải là 10 số");
      return false;
    }

    return true;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      setSuccess("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
      setFormData({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        dateOfBirth: "",
        gender: "chưa chọn",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>ĐĂNG KÝ</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  type="text"
                  name="fullname"
                  placeholder=" "
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
                <label>Họ và tên</label>
              </div>

              <div className="form-group floating">
                <input
                  type="text"
                  name="username"
                  placeholder=" "
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <label>Tên đăng nhập</label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label>Email</label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  type="password"
                  name="password"
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label>Mật khẩu</label>
              </div>

              <div className="form-group floating">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder=" "
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <label>Nhập lại mật khẩu</label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  type="text"
                  name="phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <label>Số điện thoại</label>
              </div>
              <div className="form-group floating">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                <label>Ngày sinh</label>
              </div>
            </div>
            <div className="gender">
              <span>Giới tính:</span>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="nam"
                  checked={formData.gender === "nam"}
                  onChange={handleChange}
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="nữ"
                  checked={formData.gender === "nữ"}
                  onChange={handleChange}
                />
                Nữ
              </label>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
            </button>
            <Link to="/login" className="auth-link">
              ← Quay lại đăng nhập
            </Link>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
