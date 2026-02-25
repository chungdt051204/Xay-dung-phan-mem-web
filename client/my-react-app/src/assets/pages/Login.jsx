import { useRef, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import { api } from "../../App";
import "../style/Auth.css";
import LoginGoogle from "../components/LoginGoogle";

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
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ token, data, message }) => {
        localStorage.setItem("token", token);
        setIsLogin(true);
        setMe(data);
        toast.success(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
        setRefresh((p) => p + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        setErr(message);
      });
  };

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-card auth-card--login">
          <h2>ĐĂNG NHẬP</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên đăng nhập / Email</label>
              <input ref={input} required autoComplete="off" />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                ref={password}
                required
                autoComplete="new-password"
              />
            </div>

            {err && <p className="error">{err}</p>}

            <button className="btn-primary">Đăng nhập</button>

            <div className="google-login-wrapper">
              <LoginGoogle />
            </div>
            <Link to="/password" className="auth-link">
              Quên mật khẩu
            </Link>
            <Link to="/register" className="auth-link">
              Bạn chưa có tài khoản? <b>Đăng ký ngay</b>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
