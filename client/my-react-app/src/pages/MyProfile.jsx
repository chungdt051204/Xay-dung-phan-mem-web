import { useContext, useState, useRef, useEffect } from "react";
import AppContext from "../components/AppContext";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import "../style/MyProfile.css";
import { api } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GENDER_OPTIONS = ["Nam", "Nữ", "Khác"];

export default function MyProfile() {
  const navigate = useNavigate();
  const { me } = useContext(AppContext);
  const fileRef = useRef();

  const [form, setForm] = useState({ fullname: "", gender: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, msg: "", type: "" });

  // Cập nhật form khi dữ liệu 'me' từ Context đã load xong
  useEffect(() => {
    if (me) {
      setForm({
        fullname: me.fullname || "",
        gender: me.gender === "chưa chọn" ? "" : me.gender,
      });
      setAvatarPreview(me.avatar);
    }
  }, [me]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ ...status, msg: "" });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setStatus({ loading: true, msg: "", type: "" });
    console.log(form.fullname, form.gender, avatarFile);

    try {
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("gender", form.gender);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch(`${api}/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Lỗi cập nhật");
      setStatus({
        loading: false,
        msg: "Cập nhật thành công!",
        type: "success",
      });
      toast.success(result.message);
      navigate("/");
    } catch (err) {
      setStatus({ loading: false, msg: err.message, type: "error" });
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="profile-page">
        <div className="profile-card">
          {/* Cột trái: Avatar & Thông tin cơ bản */}
          <div className="profile-left">
            <div
              className="avatar-wrapper"
              onClick={() => fileRef.current.click()}
            >
              <img src={avatarPreview || "/default-avatar.png"} alt="avatar" />
              <div className="avatar-overlay">
                <span>Đổi ảnh</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                hidden
                onChange={handleAvatarChange}
              />
            </div>
            <h2 className="profile-name">{me?.fullname}</h2>
            <div className={`role-badge ${me?.roles}`}>{me?.roles}</div>
            <p className="join-date">
              Gia nhập: {new Date(me?.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>

          {/* Cột phải: Form chỉnh sửa */}
          <form className="profile-right" onSubmit={handleSubmit}>
            <h1 className="form-title">Hồ sơ cá nhân</h1>

            <div className="form-grid">
              <div className="field-group">
                <label>Họ và tên</label>
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label>Giới tính</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn --</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>Tên đăng nhập (Không thể sửa)</label>
                <input
                  className="field-readonly"
                  value={me?.username || ""}
                  disabled
                />
              </div>

              <div className="field-group">
                <label>Email</label>
                <input
                  className="field-readonly"
                  value={me?.email || ""}
                  disabled
                />
              </div>

              <div className="field-group">
                <label>Phương thức đăng nhập</label>
                <div className="login-tag">{me?.loginMethod}</div>
              </div>
            </div>

            {status.msg && (
              <div className={`msg-${status.type}`}>{status.msg}</div>
            )}

            <button
              type="submit"
              className="btn-save"
              disabled={status.loading}
            >
              {status.loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
