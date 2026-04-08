import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import fetchApi from "../service/api";
import LineChart from "../components/LineChart";
import { api } from "../App";
import BarChart from "../components/BarChart";
import "../style/Dashboard.css";
export default function Dashboard() {
  const { products, users, orders } = useContext(AppContext);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const totalRevenue = orders?.docs?.reduce((sum, value) => {
    return sum + value.totalAmount;
  }, 0);
  useEffect(() => {
    fetchApi({ url: `${api}/revenue-trend`, setData: setRevenueTrend });
  }, []);
  useEffect(() => {
    fetchApi({ url: `${api}/category-stats`, setData: setCategoryStats });
  }, []);
  useEffect(() => {
    fetchApi({ url: `${api}/best-seller`, setData: setBestSeller });
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Báo cáo hệ thống</h2>

      {/* 1. Các thẻ số liệu nhanh */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng sản phẩm</div>
          <div className="stat-value">{products?.docs?.length || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tổng đơn hàng</div>
          <div className="stat-value">{orders?.docs?.length || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Người dùng</div>
          <div className="stat-value">{users?.docs?.length || 0}</div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-label">Tổng doanh thu</div>
          <div className="stat-value">{totalRevenue?.toLocaleString()} VNĐ</div>
        </div>
      </div>

      {/* 2. Khu vực biểu đồ */}
      <div className="charts-container">
        <div className="chart-box">
          <h3>Xu hướng doanh thu</h3>
          <LineChart data={revenueTrend} />
        </div>
        <div className="chart-box">
          <h3>Doanh thu theo loại</h3>
          <BarChart data={categoryStats} />
        </div>
      </div>

      {/* 3. Bảng sản phẩm bán chạy */}
      <div className="table-section">
        <h3>Top 5 sản phẩm bán chạy</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng bán</th>
            </tr>
          </thead>
          <tbody>
            {bestSeller?.map((value, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{value.productName || value._id}</td>
                <td className="text-bold">{value.totalQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
