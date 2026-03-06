import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import AppContext from "../components/AppContext";
import Footer from "../components/Footer";
import UserNavbar from "../components/UserNavbar";
import { useNavigate } from "react-router-dom";
import fetchApi from "../../service/api";
import { api } from "../../App";

export default function MyOrder() {
  const { isLoading, isLogin, refresh, setRefresh, me } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [myOrders, setMyOrders] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (!isLoading) {
      if (!isLogin) {
        navigate("/");
        return;
      }
    }
  }, [isLoading, isLogin, navigate]);
  useEffect(() => {
    if (me) {
      fetchApi({ url: `${api}/order?userId=${me?._id}`, setData: setMyOrders });
    }
  }, [me]);
  return (
    <>
      <UserNavbar />
      <h2>Đơn hàng của tôi</h2>
      <table border={1} cellSpacing={0}>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Tổng tiền</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng thái</th>
            <th>Trạng thái thanh toán</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {myOrders?.docs?.map((value) => {
            return (
              <tr key={value._id}>
                <td>{value._id}</td>
                <td>{value.totalAmount + " " + "VNĐ"}</td>
                <td>{value.paymentMethod}</td>
                <td>{value.status}</td>
                <td>{value.paymentStatus}</td>
                <td>{value.createdAt}</td>
                <td>
                  {value.status === "Chờ xác nhận" && (
                    <button>Hủy đơn hàng</button>
                  )}
                  <Link to={`/my-orders/detail?orderId=${value._id}`}>
                    <button>Xem chi tiết</button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Footer />
    </>
  );
}
