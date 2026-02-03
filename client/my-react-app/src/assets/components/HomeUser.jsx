import { useContext } from "react";
import AppContext from "./AppContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function HomeUser() {
  const { isLogin, me } = useContext(AppContext);
  return (
    <>
      <Navbar />
      {isLogin && me !== null ? (
        <p>Xin chào {me.username}</p>
      ) : (
        <p>Bạn chưa đăng nhập</p>
      )}
      <Footer />
    </>
  );
}
