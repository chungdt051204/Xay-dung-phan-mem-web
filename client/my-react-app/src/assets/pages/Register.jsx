import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../App";
import { toast } from "react-toastify";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import "../style/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const phoneRegex = /^0\d{9}$/;
  const registerSchema = z
    .object({
      fullname: z.string().trim().min(1, "Họ tên không được bỏ trống"),
      username: z
        .string()
        .trim()
        .min(1, "Tên đăng nhập phải có tối thiểu 5 ký tự"),
      email: z.email("Email không đúng định dạng"),
      password: z.string().trim().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
      confirmPassword: z.string(),
      phone: z
        .string()
        .min(1, "Vui lòng nhập số điện thoại")
        .regex(phoneRegex, "Số điện thoại không hợp lệ"),
      dateOfBirth: z.coerce.date("Vui lòng chọn ngày sinh hợp lệ"),
      gender: z
        .enum(["nam", "nữ", "chưa chọn"])
        .optional()
        .default("chưa chọn"),
      avatar: z
        .any()
        .refine((files) => files?.length > 0, "Vui lòng chọn file"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      dateOfBirth: "",
      gender: "chưa chọn",
    },
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    setLoading(true);
    const dataToSend = new FormData();
    dataToSend.append("fullname", data.fullname);
    dataToSend.append("username", data.username);
    dataToSend.append("email", data.email);
    dataToSend.append("password", data.password);
    dataToSend.append("confirmPassword", data.confirmPassword);
    dataToSend.append("phone", data.phone);
    dataToSend.append("dateOfBirth", data.dateOfBirth);
    dataToSend.append("gender", data.gender);
    dataToSend.append("avatar", data.avatar[0]);
    localStorage.setItem("resetEmail", data.email);
    localStorage.setItem("method", "register");
    fetch(`${api}/register`, {
      method: "POST",
      body: dataToSend,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setTimeout(() => {
          navigate("/confirm");
        }, 1000);
      })
      .catch(async (err) => {
        if (err.status === 409) {
          const { message } = await err.json();
          setError(message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
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
