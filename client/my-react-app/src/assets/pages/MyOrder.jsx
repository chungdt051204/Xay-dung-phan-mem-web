import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import AppContext from "../components/AppContext";
import Footer from "../components/Footer";
import UserNavbar from "../components/UserNavbar";
import { useNavigate } from "react-router-dom";
import fetchApi from "../../service/api";
import { api } from "../../App";
import "../style/MyOrder.css";
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
     <div className="order-wrap">
  <div className="order-header">
    <h2>Đơn hàng của tôi</h2>
  </div>
  <div className="order-table-wrapper">
    <table className="order-table">
      <thead>
        <tr>
          <th style={{width:'22%'}}>Mã đơn</th>
          <th style={{width:'13%'}}>Tổng tiền</th>
          <th style={{width:'13%'}}>Thanh toán</th>
          <th style={{width:'13%'}}>Trạng thái</th>
          <th style={{width:'13%'}}>TT thanh toán</th>
          <th style={{width:'13%'}}>Ngày tạo</th>
          <th style={{width:'13%'}}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {myOrders?.docs?.map((value) => (
          <tr key={value._id}>
            <td><span className="order-id">{value._id}</span></td>
            <td><strong>{value.totalAmount.toLocaleString()} VNĐ</strong></td>
            <td>{value.paymentMethod}</td>
            <td>
              <span className={`badge ${
                value.status === 'Chờ xác nhận' ? 'badge-pending' :
                value.status === 'Đã xác nhận'  ? 'badge-confirmed' : 'badge-cancelled'
              }`}>{value.status}</span>
            </td>
            <td>
              <span className={`badge ${value.paymentStatus === 'Đã thanh toán' ? 'badge-paid' : 'badge-unpaid'}`}>
                {value.paymentStatus}
              </span>
            </td>
            <td style={{fontSize:'12px', color:'#888'}}>{new Date(value.createdAt).toLocaleDateString('vi-VN')}</td>
            <td>
              {value.status === 'Chờ xác nhận' && <button className="btn-cancel">Hủy</button>}
              <Link to={`/my-orders/detail?orderId=${value._id}`}>
                <button className="btn-detail">Chi tiết</button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      <Footer />
    </>
  );
}
