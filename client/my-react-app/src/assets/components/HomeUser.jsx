import { Link } from "react-router-dom";
import { useContext } from "react";
import AppContext from "./AppContext";

export default function HomeUser() {
  const { isLogin, me } = useContext(AppContext);
  return (
    <>
      {isLogin && me ? (
        <div>
          <p>Xin chào {me?.username}</p>
          <button>Đăng xuất</button>
        </div>
      ) : (
        <div>
          <h2>Bạn chưa đăng nhập</h2>
          <Link to="/login">
            <button>Đăng nhập</button>
          </Link>
        </div>
      )}
    </>
  );
}
