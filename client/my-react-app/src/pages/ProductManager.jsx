import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import { api } from "../App";
import Pagination from "../components/PaginationButton";
import { useSearchParams } from "react-router-dom";
import fetchApi from "../service/api";

const initialForm = {
  name: "",
  price: "",
  desc: "",
  specs: "",
  stock: "",
  status: "còn bán",
  brandId: "",
  categoryId: "",
  image: "",
  colorsText: "",
  imagesText: "",
};

export default function ProductManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const { brands, categories, refresh, setRefresh } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [idEdit, setIdEdit] = useState("");
  useEffect(() => {
    const params = new URLSearchParams();
    if (page) params.append("_page", page);
    fetchApi({
      url: `${api}/product?${params.toString()}&_limit=10`,
      setData: setProducts,
    });
  }, [refresh, page]);

  // Hàm xử lý Input chung cho tất cả các trường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRow = (p) => {
    setIdEdit(p._id);
    setFormData({
      name: p.productName,
      price: p.price,
      desc: p.description,
      specs: p.techSpecs,
      image: p.image,
      stock: p.quantityStock,
      status: p.status,
      brandId: p.brandId?._id || p.brandId,
      categoryId: p.categoryId?._id || p.categoryId,
      colorsText: (p.colors || []).join(", "),
      imagesText: (p.images || []).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitData = (method, url, successMsg) => {
    const colors = formData.colorsText
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);
    const images = formData.imagesText
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img);

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        id: idEdit,
        productName: formData.name,
        price: formData.price,
        techSpecs: formData.specs,
        description: formData.desc,
        image: formData.image,
        quantityStock: formData.stock,
        status: formData.status,
        brandId: formData.brandId,
        categoryId: formData.categoryId,
        colors,
        images,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Thao tác thất bại");
        setRefresh((prev) => prev + 1);
        toast.success(successMsg);
        if (method === "PUT" || method === "POST") handleClear();
      })
      .catch((err) => toast.error(err.message));
  };

  const handleClear = () => {
    setFormData(initialForm);
    setIdEdit("");
  };

  // Style nhanh cho các ô Input
  const inputClassName = "form-input-custom";

  return (
    <div style={{ padding: "2vw", background: "#f3f4f6", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>
        Quản lý sản phẩm
      </h2>

      {/* Form Container */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          {idEdit ? "✏️ Chỉnh sửa" : "➕ Thêm mới"}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <div className="field">
            <label>Tên sản phẩm</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div className="field">
            <label>Giá (VNĐ)</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div className="field">
            <label>Thương hiệu</label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Chọn thương hiệu</option>
              {brands?.docs?.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.brandName}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Danh mục</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Chọn danh mục</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Tồn kho</label>
            <input
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div className="field">
            <label>Ảnh chính (URL)</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Mô tả & Thông số</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                name="desc"
                placeholder="Mô tả"
                value={formData.desc}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                name="specs"
                placeholder="Thông số"
                value={formData.specs}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {!idEdit ? (
            <button
              onClick={() =>
                submitData("POST", `${api}/product`, "Thêm thành công")
              }
              style={styles.btnPrimary}
            >
              + Thêm mới
            </button>
          ) : (
            <button
              onClick={() =>
                submitData("PUT", `${api}/product`, "Cập nhật thành công")
              }
              style={styles.btnUpdate}
            >
              ✏️ Cập nhật
            </button>
          )}
          <button onClick={handleClear} style={styles.btnClear}>
            Xóa trắng
          </button>
        </div>
      </div>

      {/* Bảng danh sách - Responsive Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                <th style={styles.th}>Sản phẩm</th>
                <th style={styles.th}>Giá</th>
                <th style={styles.th}>Kho</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products?.docs?.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={styles.td}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={p.image}
                        width="40"
                        height="40"
                        style={{ borderRadius: "5px", objectFit: "cover" }}
                      />
                      <span style={{ fontWeight: "500" }}>{p.productName}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{Number(p.price).toLocaleString()}đ</td>
                  <td style={styles.td}>{p.quantityStock}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        background: p.quantityStock > 0 ? "#dcfce7" : "#fee2e2",
                        color: p.quantityStock > 0 ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {p.quantityStock > 0 ? "Còn bán" : "Ngừng bán"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleRow(p)}
                      style={{
                        border: "none",
                        background: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() =>
                        submitData(
                          "DELETE",
                          `${api}/product/${p._id}`,
                          "Đã xóa"
                        )
                      }
                      style={{
                        border: "none",
                        background: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination totalPages={products?.totalPages} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
    marginTop: "5px",
  },
  th: { padding: "12px 15px", color: "#64748b", fontSize: "13px" },
  td: { padding: "12px 15px", fontSize: "14px" },
  // Thêm style riêng cho cột sản phẩm
  tdName: {
    padding: "12px 15px",
    fontSize: "14px",
    maxWidth: "200px", // Giới hạn chiều rộng (bạn có thể chỉnh con số này)
    overflow: "hidden", // Ẩn phần thừa
    textOverflow: "ellipsis", // Hiện dấu ... nếu tên quá dài
    whiteSpace: "nowrap", // Không cho xuống dòng
  },
  btnPrimary: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnUpdate: {
    padding: "10px 20px",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnClear: {
    padding: "10px 20px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
