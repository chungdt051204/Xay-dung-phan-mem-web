import { api } from "../../App";
import logo_google from "../logo-google.png";
import "../style/LoginGoogle.css";
export default function LoginGoogle() {
  return (
    <>
      <div
        onClick={() => (window.location.href = `${api}/auth/google`)}
        className="login-google-button"
      >
        <div className="google-icon-container">
          <img className="google-icon" src={logo_google} alt="Google logo" />
        </div>
        <p className="button-text">Đăng nhập với google</p>
      </div>
    </>
  );
}
