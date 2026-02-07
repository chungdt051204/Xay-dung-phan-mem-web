import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../App";
import "../style/Auth.css";

export default function Password() {
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${api}/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.current.value,
        password: password.current.value,
      }),
    }).then((res) => {
      if (!res.ok) return Promise.reject(res);
      localStorage.setItem("resetPassword", password.current.value);
      localStorage.setItem("resetEmail", email.current.value);
      localStorage.setItem("method", "password");
      navigate("/confirm");
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>ĐẶT LẠI MẬT KHẨU</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input ref={email} required />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" ref={password} required />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input type="password" ref={confirmPassword} required />
          </div>

          {err && <p className="error">{err}</p>}

          <button className="btn-primary">Đặt lại mật khẩu</button>

          <Link to="/login" className="auth-link">
            Quay lại <b>Đăng nhập</b>
          </Link>
        </form>
      </div>
    </div>
  );
}
