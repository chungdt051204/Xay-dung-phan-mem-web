import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../App";
import { toast } from "react-toastify";
import "../style/Auth.css";

export default function Confirm() {
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const input = useRef();

  const handleSubmit = (e) => {
    console.log(input.current.value);
    e.preventDefault();
    fetch(`${api}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: input.current.value,
        password: localStorage?.getItem("resetPassword"),
        email: localStorage.getItem("resetEmail"),
        method: localStorage.getItem("method"),
      }),
    })
      .then((res) => {
        if (!res.ok) return Promise.reject(res);
        localStorage.removeItem("resetPassword");
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("method");
        toast.success("Xác nhận thành công");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        setErr(message);
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>XÁC NHẬN EMAIL</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Code</label>
            <input ref={input} required maxLength={6} />
          </div>
          {err && <p className="error">{err}</p>}
          <button className="btn-primary">Xác nhận</button>
        </form>
      </div>
    </div>
  );
}
