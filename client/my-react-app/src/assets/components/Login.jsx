import { useRef, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "./AppContext";
import { api } from "../../App";
import "../style/Auth.css";
import LoginGoogle from "./LoginGoogle";

export default function Login() {
  const { setRefresh, setIsLogin, setMe } = useContext(AppContext);
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const input = useRef();
  const password = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${api}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: input.current.value,
        password: password.current.value,
      }),
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then(({ token, data }) => {
        localStorage.setItem("token", token);
        setIsLogin(true);
        setMe(data);
        setRefresh(p => p + 1);
        navigate("/");
      })
      .catch(async (err) => {
        const { message } = await err.json();
        setErr(message);
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>ĐĂNG NHẬP</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email / Số điện thoại</label>
            <input ref={input} required />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" ref={password} required />
          </div>

          {err && <p className="error">{err}</p>}

          <button className="btn-primary">Đăng nhập</button>

          <LoginGoogle />

          <Link to="/register" className="auth-link">
            Bạn chưa có tài khoản? <b>Đăng ký ngay</b>
          </Link>
        </form>
      </div>
    </div>
  );
}
