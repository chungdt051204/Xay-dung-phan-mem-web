import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "./AppContext";
import { api } from "../../App";
import {Link} from "react-router-dom"
import Navbar from "./Navbar";
import Footer from "./Footer";

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input.current.value,
        password: password.current.value,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message, token, data }) => {
        localStorage.setItem("token", token);
        setIsLogin(true);
        setMe(data);
        setRefresh((prev) => prev + 1);
        alert(message);
        navigate("/");
      })
      .catch(async (err) => {
        const { message } = await err.json();
        setErr(message);
      });
  };
  return (
    <>
    <Navbar/>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={input}
          placeholder="Email/Tên đăng nhập"
          required
          autoComplete="off"
        />
        <br />
        <input
          type="password"
          ref={password}
          placeholder="Mật khẩu"
          required
          autoComplete="new-password"
        />
        <br />
        {err && <span style={{ color: "red" }}>{err}</span>}
        <br />
        <button>Đăng nhập</button>
      </form>
      <Link to="/register">
      <p>Chua co tai khoan dang ky ngay</p>
      </Link>
      <Footer/>
    </>
  );
}
