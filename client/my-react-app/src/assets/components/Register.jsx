import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../App";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../style/Auth.css";

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
    setError(""); // Clear error when user starts typing
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

      // Redirect to login after 2 seconds
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
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group floating">
                <input {...register("fullname")} type="text" />
                <label>Họ và tên</label>
                <strong>{errors?.fullname?.message}</strong>
              </div>

              <div className="form-group floating">
                <input {...register("username")} type="text" />
                <label>Tên đăng nhập</label>
                <strong>{errors?.username?.message}</strong>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group floating">
                <input {...register("email")} type="text" />
                <label>Email</label>
                <strong>{error ? error : ""}</strong>
                <strong>{errors?.email?.message}</strong>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group floating">
                <input {...register("password")} type="password" />
                <label>Mật khẩu</label>
                <strong>{errors?.password?.message}</strong>
              </div>

              <div className="form-group floating">
                <input {...register("confirmPassword")} type="password" />
                <label>Nhập lại mật khẩu</label>
                <strong>{errors?.confirmPassword?.message}</strong>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group floating">
                <input {...register("phone")} type="text" />
                <label>Số điện thoại</label>
                <strong>{errors?.phone?.message}</strong>
              </div>

              <div className="form-group floating">
                <input {...register("dateOfBirth")} type="date" />
                <label>Ngày sinh</label>
                <strong>{errors?.dateOfBirth?.message}</strong>
              </div>
            </div>
            <div className="gender">
              <span>Giới tính:</span>
              <label>
                <input {...register("gender")} type="radio" value="nam" />
                Nam
              </label>
              <label>
                <input {...register("gender")} type="radio" value="nữ" />
                Nữ
              </label>
            </div>
            <div className="form-group">
              <label>Ảnh đại diện</label>
              <input
                {...register("avatar")}
                type="file"
                name="avatar"
                accept="image/*"
              />
            </div>
            <strong>{errors?.avatar?.message}</strong>
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
