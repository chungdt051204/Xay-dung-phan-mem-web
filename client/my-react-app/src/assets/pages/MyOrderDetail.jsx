import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import fetchApi from "../../service/api";
import { api } from "../../App";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import "../style/MyOrderDetail.css";
export default function MyOrderDetail() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { isLoading, isLogin, refresh, setRefresh } = useContext(AppContext);
  const [myOrderDetail, setMyOrderDetail] = useState(null);
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
    if (orderId) {
      fetchApi({
        url: `${api}/order?orderId=${orderId}`,
        setData: setMyOrderDetail,
      });
    }
  }, [orderId]);
  useEffect(() => {
    console.log(myOrderDetail);
  }, [myOrderDetail]);
 return (
  <>
    <UserNavbar />
    <div className="od-wrap">
      <h2 className="od-title">Chi tiết đơn hàng</h2>
      <div className="od-grid">
        <div className="od-card">
          <p className="od-card-title">Thông tin đặt hàng</p>
          <div className="od-row"><span className="od-label">Họ và tên</span><span className="od-value">{myOrderDetail?.fullname}</span></div>
          <div className="od-row"><span className="od-label">Số điện thoại</span><span className="od-value">{myOrderDetail?.phone}</span></div>
          <div className="od-row"><span className="od-label">Địa chỉ</span><span className="od-value">{myOrderDetail?.address}</span></div>
        </div>

        <div className="od-card">
          <p className="od-card-title">Tình trạng đơn hàng</p>
          <div className="od-row">
            <span className="od-label">Trạng thái</span>
            <span className={`badge ${myOrderDetail?.status === 'Chờ xác nhận' ? 'badge-pending' : myOrderDetail?.status === 'Đã xác nhận' ? 'badge-confirmed' : 'badge-cancelled'}`}>
              {myOrderDetail?.status}
            </span>
          </div>
          <div className="od-row"><span className="od-label">Thanh toán</span><span className="od-value">{myOrderDetail?.paymentMethod}</span></div>
          <div className="od-row">
            <span className="od-label">TT thanh toán</span>
            <span className={`badge ${myOrderDetail?.paymentStatus === 'Đã thanh toán' ? 'badge-paid' : 'badge-unpaid'}`}>
              {myOrderDetail?.paymentStatus}
            </span>
          </div>
          <div className="od-timeline">
            <div className="od-dot" />
            <div>
              <p className="od-timeline-text">
                {myOrderDetail?.status === 'Chờ xác nhận' ? 'Đơn hàng đang chờ xác nhận' : myOrderDetail?.status}
              </p>
              <p className="od-timeline-date">
                {new Date(myOrderDetail?.createdAt).toLocaleDateString('vi-VN')} · {new Date(myOrderDetail?.createdAt).toLocaleTimeString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="od-card">
        <p className="od-card-title">Danh sách sản phẩm</p>
        <table className="od-product-table">
          <thead>
            <tr>
              <th style={{width:'50%'}}>Sản phẩm</th>
              <th>Đơn giá</th>
              <th style={{textAlign:'center'}}>Số lượng</th>
              <th style={{textAlign:'right'}}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {myOrderDetail?.items?.map((value) => (
              <tr key={value._id}>
                <td>
                  <div className="product-cell">
                    <img src={value.productId.image} alt="" className="product-img" />
                    <div>
                      <p className="product-name">{value.productId.productName}</p>
                      <p className="product-desc">{value.productId.description}</p>
                    </div>
                  </div>
                </td>
                <td>{value.productId.price.toLocaleString()} VNĐ</td>
                <td style={{textAlign:'center'}}>{value.quantity}</td>
                <td style={{textAlign:'right', fontWeight:600}}>{value.amount.toLocaleString()} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="od-total-bar">
          <span className="od-total-label">Tổng cộng</span>
          <span className="od-total-value">{myOrderDetail?.totalAmount?.toLocaleString()} VNĐ</span>
        </div>
      </div>

      {myOrderDetail?.status === 'Chờ xác nhận' && (
        <div style={{display:'flex', justifyContent:'flex-end'}}>
          <button className="btn-cancel">Hủy đơn hàng</button>
        </div>
      )}
    </div>
    <Footer />
  </>
);
}
