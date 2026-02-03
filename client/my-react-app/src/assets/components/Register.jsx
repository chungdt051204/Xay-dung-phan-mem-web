import "../style/Auth.css";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>ĐĂNG KÝ</h2>

        <form className="auth-form">
          <div className="form-row">
            <div className="form-group floating">
              <input type="text" placeholder=" " required />
              <label>Họ và tên</label>
            </div>

            <div className="form-group floating">
              <input type="date" placeholder=" " required />
              <label>Ngày sinh</label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group floating">
              <input type="text" placeholder=" " required />
              <label>Số điện thoại</label>
            </div>

            <div className="form-group floating">
              <input type="email" placeholder=" " />
              <label>Email (không bắt buộc)</label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group floating">
              <input type="password" placeholder=" " required />
              <label>Mật khẩu</label>
            </div>

            <div className="form-group floating">
              <input type="password" placeholder=" " required />
              <label>Nhập lại mật khẩu</label>
            </div>
          </div>

          <div className="gender">
            <span>Giới tính:</span>
            <label>
              <input type="radio" name="gender" /> Nam
            </label>
            <label>
              <input type="radio" name="gender" /> Nữ
            </label>
          </div>

          <button className="btn-primary">Hoàn tất đăng ký</button>

          <Link to="/login" className="auth-link">
            ← Quay lại đăng nhập
          </Link>
        </form>
      </div>
    </div>
  );
}
