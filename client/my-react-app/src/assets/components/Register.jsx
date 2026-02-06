import "../style/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";
import { api } from "../../App";

export default function Register() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const avatar = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");
    localStorage.setItem("resetEmail", formData.email);
    localStorage.setItem("method", "register");
    try {
      const response = await fetch(`${api}/register`, {
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

      navigate("/confirm");
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
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  type="text"
                  required
                />
                <label>Họ và tên</label>
              </div>

              <div className="form-group floating">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  required
                />
                <label>Tên đăng nhập</label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
                <label>Email</label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
                <label>Mật khẩu</label>
              </div>

              <div className="form-group floating">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  required
                />
                <label>Nhập lại mật khẩu</label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group floating">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  required
                />
                <label>Số điện thoại</label>
              </div>
              <div className="form-group floating">
                <input
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  type="date"
                  required
                />
                <label>Ngày sinh</label>
              </div>
            </div>
            <div className="gender">
              <span>Giới tính:</span>
              <label>
                <input
                  checked={gender === "nam"}
                  value="nam"
                  onChange={(e) => setGender(e.target.value)}
                  type="radio"
                />
                Nam
              </label>
              <label>
                <input
                  checked={gender === "nữ"}
                  value="nữ"
                  onChange={(e) => setGender(e.target.value)}
                  type="radio"
                  name="gender"
                />
                Nữ
              </label>
            </div>
            <div className="form-group">
              <label>Ảnh đại diện</label>
              <input ref={avatar} type="file" name="avatar" accept="image/*" />
            </div>
            <button className="btn-primary">Hoàn tất đăng ký</button>
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
