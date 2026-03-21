import { useContext, useState, useRef } from "react";
import { AppContext } from "../App.jsx"; // Điều chỉnh path nếu cần
import "./MyProfile.css";

const GENDER_OPTIONS = ["Nam", "Nữ", "Khác"];

export default function MyProfile() {
  const { me, setMe, token } = useContext(AppContext);

  const [form, setForm] = useState({
    fullname: me?.fullname || "",
    phone: me?.phone || "",
    gender: me?.gender || "",
    dateOfBirth: me?.dateOfBirth
      ? new Date(me.dateOfBirth).toISOString().split("T")[0]
      : "",
  });
  const [avatarPreview, setAvatarPreview] = useState(me?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("phone", form.phone);
      formData.append("gender", form.gender);
      formData.append("dateOfBirth", form.dateOfBirth);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch("http://localhost:3000/me", {
        method: "PUT",
        headers: {
          // ✅ Gửi Bearer token — KHÔNG set Content-Type khi dùng FormData
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");

      setMe(data.data); // Cập nhật context
      setSuccess("Cập nhật thông tin thành công!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* ── Left Panel ── */}
        <div className="profile-left">
          <div
            className="avatar-wrapper"
            onClick={() => fileRef.current.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" />
            ) : (
              <div className="avatar-placeholder">
                <span className="avatar-initial">
                  {me?.fullname?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}
            <div className="avatar-overlay">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>Đổi ảnh</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>

          <h2 className="profile-name">{me?.fullname || "Người dùng"}</h2>
          <p className="profile-email">{me?.email}</p>

          <div className="role-badge">
            {me?.roles === "admin" ? "👑 Admin" : "🙍 Thành viên"}
          </div>

          <div className="login-method">
            <span className="login-dot" />
            {me?.loginMethod || "Email thường"}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <form className="profile-right" onSubmit={handleSubmit}>
          <div className="form-header">
            <h1 className="form-title">Thông tin cá nhân</h1>
            <p className="form-subtitle">Cập nhật hồ sơ của bạn</p>
          </div>

          <div className="form-grid">
            <div className="field-group">
              <label className="field-label">Họ và tên</label>
              <input
                className="field-input"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Số điện thoại</label>
              <input
                className="field-input"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0901234567"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Giới tính</label>
              <select
                className="field-input"
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
              <label className="field-label">Ngày sinh</label>
              <input
                className="field-input"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Read-only */}
          <div className="field-group">
            <label className="field-label">Tên đăng nhập</label>
            <input
              className="field-input--readonly"
              value={me?.username || ""}
              disabled
            />
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              className="field-input--readonly"
              value={me?.email || ""}
              disabled
            />
          </div>

          {success && <div className="msg-success">✅ {success}</div>}
          {error && <div className="msg-error">❌ {error}</div>}

          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "⏳ Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}