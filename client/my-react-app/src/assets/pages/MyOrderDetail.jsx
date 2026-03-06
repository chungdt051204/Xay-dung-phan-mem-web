import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import fetchApi from "../../service/api";
import { api } from "../../App";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";

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
      <h2>Chi tiết đơn hàng</h2>
      <h3>Thông tin đặt hàng</h3>
      <p>
        <b>Họ và tên:</b>
        {myOrderDetail?.fullname}
      </p>
      <p>
        <b>Địa chỉ:</b>
        {myOrderDetail?.address}
      </p>
      <p>
        <b>Số điện thoại:</b>
        {myOrderDetail?.phone}
      </p>
      <br />
      <h3>Tình trạng đơn hàng</h3>
      <div style={{ display: "flex", gap: "5px" }}>
        <p>
          {new Date(myOrderDetail?.createdAt).toLocaleDateString() +
            " " +
            new Date(myOrderDetail?.createdAt).toLocaleTimeString()}
        </p>
        <p>
          {myOrderDetail?.status === "Chờ xác nhận"
            ? "Đơn hàng đang chờ xác nhận"
            : ""}
        </p>
      </div>
      <br />
      <h3>Danh sách sản phẩm</h3>
      <table border={1} cellSpacing={0}>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {myOrderDetail?.items?.map((value) => {
            return (
              <tr key={value._id}>
                <td>
                  <img
                    src={value.productId.image}
                    alt=""
                    width={80}
                    height={100}
                  />
                  <p>{value.productId.productName}</p>
                  <p>{value.productId.description}</p>
                  <p>{value.productId.techSpecs}</p>
                </td>
                <td>{`${value.productId.price} VNĐ`}</td>
                <td>{value.quantity}</td>
                <td>{`${value.amount} VNĐ`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>Tổng tiền: {`${myOrderDetail?.totalAmount} VNĐ`}</h3>
      <Footer />
    </>
  );
}
