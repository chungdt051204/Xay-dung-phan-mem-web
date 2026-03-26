import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../components/AppContext";
import fetchApi from "../../service/api";
import { api } from "../../App";
import "../style/OrderManager.css";

export default function OrderManager() {
  const { me, isLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [paymentFilter, setPaymentFilter] = useState("Tất cả");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [newRefundStatus, setNewRefundStatus] = useState("");
  const [refundOrderId, setRefundOrderId] = useState(null);
  const [isLoading2, setIsLoading2] = useState(true);

  const statuses = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang giao",
    "Đã giao",
    "Đã hủy",
  ];
  const paymentStatuses = ["Tất cả", "Đã thanh toán", "Chưa thanh toán"];
  const refundStatuses = ["Chưa hoàn tiền", "Đang xử lý", "Đã hoàn tiền"];

  // Check admin access
  useEffect(() => {
    if (!isLoading) {
      if (!me || me?.roles !== "admin") {
        navigate("/");
        return;
      }
    }
  }, [isLoading, me, navigate]);

  // Fetch all orders
  useEffect(() => {
    if (me?.roles === "admin") {
      setIsLoading2(true);
      fetchApi({ url: `${api}/order`, setData: setAllOrders });
      setIsLoading2(false);
    }
  }, [me]);

  // Apply filters and search
  useEffect(() => {
    let filtered = allOrders?.docs || [];

    // Filter by status
    if (statusFilter !== "Tất cả") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by payment status
    if (paymentFilter !== "Tất cả") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === paymentFilter,
      );
    }

    // Search by order ID or customer name
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.fullname.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredOrders(filtered);
  }, [allOrders, statusFilter, paymentFilter, searchTerm]);

  // Handle process refund
  const handleProcessRefund = async () => {
    if (!refundOrderId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${api}/order/refund?id=${refundOrderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        fetchApi({ url: `${api}/order`, setData: setAllOrders });
        setShowRefundModal(false);
        setRefundOrderId(null);
        alert("Hoàn tiền thành công");
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      alert("Xử lý hoàn tiền thất bại");
    }
  };

  // Handle update order status
  const handleUpdateStatus = async () => {
    if (
      !selectedOrderId ||
      (!newStatus && !newPaymentStatus && !newRefundStatus)
    )
      return;

    const updateData = {};
    if (newStatus) updateData.status = newStatus;
    if (newPaymentStatus) updateData.paymentStatus = newPaymentStatus;
    if (newRefundStatus) updateData.refundStatus = newRefundStatus;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${api}/order?id=${selectedOrderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.result || data.message === "Cập nhật đơn hàng thành công") {
        // Refresh orders list
        fetchApi({ url: `${api}/order`, setData: setAllOrders });
        setShowModal(false);
        setSelectedOrderId(null);
        setNewStatus("");
        setNewPaymentStatus("");
        setNewRefundStatus("");
        alert("Cập nhật đơn hàng thành công");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Cập nhật đơn hàng thất bại");
    }
  };

  // Calculate statistics
  const stats = {
    total: allOrders?.docs?.length || 0,
    pending:
      allOrders?.docs?.filter((o) => o.status === "Chờ xác nhận")?.length || 0,
    confirmed:
      allOrders?.docs?.filter((o) => o.status === "Đã xác nhận")?.length || 0,
    shipped:
      allOrders?.docs?.filter((o) => o.status === "Đang giao")?.length || 0,
    delivered:
      allOrders?.docs?.filter((o) => o.status === "Đã giao")?.length || 0,
    revenue:
      allOrders?.docs?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0,
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
          {/* Statistics Section */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng đơn hàng</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Chờ xác nhận</div>
            </div>
            <div className="stat-card confirmed">
              <div className="stat-value">{stats.confirmed}</div>
              <div className="stat-label">Đã xác nhận</div>
            </div>
            <div className="stat-card shipped">
              <div className="stat-value">{stats.shipped}</div>
              <div className="stat-label">Đang giao</div>
            </div>
            <div className="stat-card delivered">
              <div className="stat-value">{stats.delivered}</div>
              <div className="stat-label">Đã giao</div>
            </div>
            <div className="stat-card revenue">
              <div className="stat-value">
                {(stats.revenue / 1000000).toFixed(1)}M
              </div>
              <div className="stat-label">Doanh thu</div>
            </div>
          </div>

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
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="filter-select"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
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
                  <th style={{ width: "11%" }}>Khách hàng</th>
                  <th style={{ width: "9%" }}>Tổng tiền</th>
                  <th style={{ width: "5%" }}>Thanh toán</th>
                  <th style={{ width: "8%" }}>Trạng thái</th>
                  <th style={{ width: "9%" }}>TT thanh toán</th>
                  <th style={{ width: "9%" }}>TT hoàn tiền</th>
                  <th style={{ width: "8%" }}>Ngày tạo</th>
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
                      <td>
                        <span
                          className={`badge ${
                            order.refundStatus === "Chưa hoàn tiền"
                              ? "badge-unpaid"
                              : order.refundStatus === "Đang xử lý"
                                ? "badge-pending"
                                : "badge-paid"
                          }`}
                        >
                          {order.refundStatus || "Chưa hoàn tiền"}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "#888" }}>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setSelectedOrderId(order._id);
                            setNewStatus(order.status);
                            setNewPaymentStatus(order.paymentStatus);
                            setNewRefundStatus(
                              order.refundStatus || "Chưa hoàn tiền",
                            );
                            setShowModal(true);
                          }}
                        >
                          Chỉnh sửa
                        </button>
                        {order.status === "Đã hủy" &&
                          order.refundStatus === "Đang xử lý" && (
                            <button
                              className="btn-refund"
                              onClick={() => {
                                setRefundOrderId(order._id);
                                setShowRefundModal(true);
                              }}
                            >
                              Hoàn tiền
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
          </div>

          {/* Update Status Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Cập nhật đơn hàng</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label>Trạng thái đơn hàng</label>
                    <select
                      value={newStatus}
                      onChange={(e) => {
                        setNewStatus(e.target.value);
                        // Tự động cập nhập refund status khi hủy đơn
                        if (
                          e.target.value === "Đã hủy" &&
                          newRefundStatus !== "Đã hoàn tiền"
                        ) {
                          setNewRefundStatus("Đang xử lý");
                        }
                      }}
                      className="form-select"
                    >
                      {statuses.slice(1).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Trạng thái thanh toán</label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value)}
                      className="form-select"
                    >
                      {paymentStatuses.slice(1).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Trạng thái hoàn tiền</label>
                    <select
                      value={newRefundStatus}
                      onChange={(e) => setNewRefundStatus(e.target.value)}
                      className="form-select"
                    >
                      {refundStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn-cancel-modal"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button className="btn-save" onClick={handleUpdateStatus}>
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Refund Modal */}
          {showRefundModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowRefundModal(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Xấc nhận hoàn tiền</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowRefundModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-body">
                  <p>Bạn có chắc chắn muốn hoàn tiền cho đơn hàng này không?</p>
                  <p
                    style={{
                      color: "#27ae60",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    Tiền sẽ được trả vào tài khoản khách hàng
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn-cancel-modal"
                    onClick={() => setShowRefundModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn-save"
                    onClick={handleProcessRefund}
                    style={{ background: "#27ae60" }}
                  >
                    Xác nhận hoàn tiền
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
