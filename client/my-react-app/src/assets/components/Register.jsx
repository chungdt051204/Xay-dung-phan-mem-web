import "./Register.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Register(){
    return(<>
    <Navbar/>
    <form>
        <h2>Đăng Ký</h2>
        <label htmlFor="">Họ và tên: </label> <input type="text" /><br />
        <label htmlFor="">Tên đăng nhập: </label> <input type="text" /><br />
        <label htmlFor="">Email: </label> <input type="text" /><br />
        <label htmlFor="">Mật khẩu: </label> <input type="password" name="" id="" /><br />
        <label htmlFor="">SĐT:</label> <input type="text" /><br />
        <form action="">
        Giới tính:
            <input type="radio"/>Nam 
            <input type="radio"/>Nữ
        </form><br />
        <label htmlFor="">Ngày sinh: </label><input type="date" name="" id="" /><br />
    </form>
    <Footer/>
    </>)
}