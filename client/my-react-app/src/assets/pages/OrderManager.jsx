import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppContext from "../components/AppContext";
import fetchApi from "../../service/api";
import { api } from "../../App";
import "../style/OrderManager.css";
import Pagination from "../components/PaginationButton";

export default function OrderManager() {
  const { isLoading, refresh, setRefresh } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [paymentFilter, setPaymentFilter] = useState("Tất cả");

  const statuses = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang giao",
    "Đã giao",
    "Đã hủy",
  ];
  const paymentStatuses = ["Tất cả", "Đã thanh toán", "Chưa thanh toán"];

  useEffect(() => {
    const params = new URLSearchParams();
    if (page) params.append("_page", page);
    fetchApi({
      url: `${api}/order?${params.toString()}&_limit=10`,
      setData: setAllOrders,
    });
  }, [page, refresh]);

  // 3. Bộ lọc và Tìm kiếm
  useEffect(() => {
    let filtered = allOrders?.docs || [];
    if (statusFilter !== "Tất cả")
      filtered = filtered.filter((o) => o.status === statusFilter);
    if (paymentFilter !== "Tất cả")
      filtered = filtered.filter((o) => o.paymentStatus === paymentFilter);
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  }, [allOrders, statusFilter, paymentFilter, searchTerm]);

  // 4. Hàm xử lý chuyển trạng thái theo luồng cố định
  const handleUpdateStatus = async (order) => {
    let nextStatus = "";
    const updateData = {};

    // Logic luồng: Xác nhận -> Đang giao -> Đã giao
    if (order.status === "Chờ xác nhận") nextStatus = "Đã xác nhận";
    else if (order.status === "Đã xác nhận") nextStatus = "Đang giao";
    else if (order.status === "Đang giao") {
      nextStatus = "Đã giao";
      // Nếu là COD, khi bấm Đã giao thành công thì tự động cập nhật Thanh toán
      if (order.paymentMethod === "COD") {
        updateData.paymentStatus = "Đã thanh toán";
      }
    }

    if (!nextStatus) return;
    updateData.status = nextStatus;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${api}/order?id=${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setRefresh((prev) => prev + 1);
      } else {
        alert("Cập nhật thất bại");
      }
    } catch (error) {
      alert("Lỗi kết nối server");
    }
  };

  return (
    <>
      {isLoading && (
        <div style={{ padding: "30px", textAlign: "center" }}>
          <p>Đang khởi tạo...</p>
        </div>
      )}
      {!isLoading && (
        <div className="order-manager">
          {/* Controls Section */}
          <div className="order-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="filter-select"
              >
                {paymentStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="order-table-wrapper">
            <table className="order-table">
              <thead>
                <tr>
                  <th style={{ width: "12%" }}>Mã đơn</th>
                  <th style={{ width: "15%" }}>Khách hàng</th>
                  <th style={{ width: "12%" }}>Tổng tiền</th>
                  <th style={{ width: "10%" }}>Thanh toán</th>
                  <th style={{ width: "10%" }}>Trạng thái</th>
                  <th style={{ width: "12%" }}>TT thanh toán</th>
                  <th style={{ width: "10%" }}>Ngày tạo</th>
                  <th style={{ width: "15%" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="order-id">{order._id}</span>
                      </td>
                      <td>{order.fullname}</td>
                      <td>
                        <strong>
                          {order.totalAmount.toLocaleString()} VNĐ
                        </strong>
                      </td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === "Chờ xác nhận"
                              ? "badge-pending"
                              : order.status === "Đã xác nhận"
                              ? "badge-confirmed"
                              : order.status === "Đang giao"
                              ? "badge-shipped"
                              : order.status === "Đã giao"
                              ? "badge-delivered"
                              : "badge-cancelled"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order.paymentStatus === "Đã thanh toán"
                              ? "badge-paid"
                              : "badge-unpaid"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "#888" }}>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        {order.status === "Chờ xác nhận" && (
                          <button
                            className="btn-edit"
                            onClick={() => handleUpdateStatus(order)}
                          >
                            Xác nhận đơn
                          </button>
                        )}
                        {order.status === "Đã xác nhận" && (
                          <button
                            className="btn-edit"
                            style={{ background: "#e67e22" }}
                            onClick={() => handleUpdateStatus(order)}
                          >
                            Bàn giao vận chuyển
                          </button>
                        )}
                        {order.status === "Đang giao" && (
                          <button
                            className="btn-edit"
                            style={{ background: "#27ae60" }}
                            onClick={() => handleUpdateStatus(order)}
                          >
                            Đã giao thành công
                          </button>
                        )}

                        <button
                          className="btn-detail"
                          onClick={() =>
                            navigate(`/my-orders/detail?orderId=${order._id}`)
                          }
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Không có đơn hàng phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination totalPages={allOrders?.docs?.totalPages} />
          </div>
        </div>
      )}
    </>
  );
}
