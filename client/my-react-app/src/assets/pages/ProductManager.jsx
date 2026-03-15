import { useContext, useState } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import { api } from "../../App";

export default function ProductManager() {
  const { products, brands, categories, setRefresh } = useContext(AppContext);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productTechSpecs, setProductTechSpecs] = useState("");
  const [productQuantityStock, setProductQuantityStock] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [productBrandId, setProductBrandId] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productColorsText, setProductColorsText] = useState("");
  const [productImagesText, setProductImagesText] = useState("");
  const [productIdEdit, setProductIdEdit] = useState("");

  const handleRow = (
    id,
    name,
    price,
    techSpecs,
    description,
    image,
    quantityStock,
    status,
    brandId,
    categoryId,
    colors,
    images
  ) => {
    setProductIdEdit(id);
    setProductName(name);
    setProductPrice(price);
    setProductTechSpecs(techSpecs);
    setProductDescription(description);
    setProductImage(image);
    setProductQuantityStock(quantityStock);
    setProductStatus(status);
    setProductBrandId(brandId);
    setProductCategoryId(categoryId);
    setProductColorsText((colors || []).join(", "));
    setProductImagesText((images || []).join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateProduct = () => {
    if (
      !productIdEdit ||
      !productName ||
      !productPrice ||
      !productTechSpecs ||
      !productDescription ||
      !productImage ||
      !productQuantityStock ||
      !productStatus ||
      !productBrandId ||
      !productCategoryId
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }
    const productColors = productColorsText
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "");
    const productImages = productImagesText
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img !== "");
    fetch(`${api}/product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        id: productIdEdit,
        productName,
        price: productPrice,
        techSpecs: productTechSpecs,
        description: productDescription,
        image: productImage,
        quantityStock: productQuantityStock,
        status: productStatus,
        brandId: productBrandId,
        categoryId: productCategoryId,
        colors: productColors,
        images: productImages,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          setProductIdEdit("");
          toast.success("Cập nhật sản phẩm thành công");
        } else {
          toast.error("Không thể cập nhật sản phẩm: " + res.statusText);
        }
      })
      .catch((error) =>
        toast.error("Không thể cập nhật sản phẩm : " + error.message)
      );
  };

  const handleDelete = (id) => {
    fetch(`${api}/product/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.token}` },
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          toast.success("Xóa sản phẩm thành công");
        } else {
          toast.error("Không thể xóa sản phẩm: " + res.statusText);
        }
      })
      .catch((error) =>
        toast.error("Không thể xóa sản phẩm : " + error.message)
      );
  };

  const handleCreateProduct = () => {
    if (
      !productName ||
      !productPrice ||
      !productTechSpecs ||
      !productDescription ||
      !productImage ||
      !productQuantityStock ||
      !productStatus ||
      !productBrandId ||
      !productCategoryId
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }
    const productImages = productImagesText
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img !== "");
    const productColors = productColorsText
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "");
    fetch(`${api}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        productName,
        price: productPrice,
        techSpecs: productTechSpecs,
        description: productDescription,
        image: productImage,
        quantityStock: productQuantityStock,
        status: productStatus,
        brandId: productBrandId,
        categoryId: productCategoryId,
        colors: productColors,
        images: productImages,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          toast.success("Tạo sản phẩm thành công");
        } else {
          toast.error("Không thể tạo sản phẩm: " + res.statusText);
        }
      })
      .catch((error) =>
        toast.error("Không thể tạo sản phẩm : " + error.message)
      );
  };

  const handleClear = () => {
    setProductIdEdit("");
    setProductName("");
    setProductPrice("");
    setProductTechSpecs("");
    setProductDescription("");
    setProductImage("");
    setProductQuantityStock("");
    setProductStatus("");
    setProductBrandId("");
    setProductCategoryId("");
    setProductColorsText("");
    setProductImagesText("");
  };

  const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px",
    display: "block",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      {/* Tiêu đề */}
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "20px",
        }}
      >
        Quản lý sản phẩm
      </h2>

      {/* Form */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          marginBottom: "28px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "16px",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "10px",
          }}
        >
          {productIdEdit ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProduct();
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "14px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>Tên sản phẩm</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="VD: iPhone 16 Pro"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Giá (VNĐ)</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="VD: 29990000"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Mô tả</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Mô tả ngắn về sản phẩm"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Thông số kỹ thuật</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="VD: Chip A18, RAM 8GB"
                value={productTechSpecs}
                onChange={(e) => setProductTechSpecs(e.target.value)}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Ảnh sản phẩm (URL)</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="https://..."
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Tồn kho</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="VD: 100"
                value={productQuantityStock}
                onChange={(e) => setProductQuantityStock(e.target.value)}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Thương hiệu</label>
              <select
                style={inputStyle}
                value={productBrandId}
                onChange={(e) => setProductBrandId(e.target.value)}
                required
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Danh mục</label>
              <select
                style={inputStyle}
                value={productCategoryId}
                onChange={(e) => setProductCategoryId(e.target.value)}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Màu sắc</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="VD: Đen, Trắng, Xanh"
                value={productColorsText}
                onChange={(e) => setProductColorsText(e.target.value)}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Danh sách ảnh (URL, ngăn cách bằng dấu phẩy)
              </label>
              <input
                style={inputStyle}
                type="text"
                placeholder="https://..., https://..."
                value={productImagesText}
                onChange={(e) => setProductImagesText(e.target.value)}
              />
            </div>
          </div>

          {/* Tình trạng */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Tình trạng</label>
            <div style={{ display: "flex", gap: "20px", marginTop: "6px" }}>
              {["còn bán", "ngừng bán"].map((val) => (
                <label
                  key={val}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "#374151",
                  }}
                >
                  <input
                    type="radio"
                    name="status"
                    value={val}
                    checked={productStatus === val}
                    onChange={(e) => setProductStatus(e.target.value)}
                    required
                  />
                  <span
                    style={{
                      padding: "2px 10px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      background: val === "còn bán" ? "#dcfce7" : "#fee2e2",
                      color: val === "còn bán" ? "#16a34a" : "#dc2626",
                      fontWeight: "500",
                    }}
                  >
                    {val === "còn bán" ? "Còn bán" : "Ngừng bán"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{
                padding: "9px 20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              + Thêm mới
            </button>
            <button
              type="button"
              onClick={handleUpdateProduct}
              style={{
                padding: "9px 20px",
                background: "#f59e0b",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ✏️ Cập nhật
            </button>
            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: "9px 20px",
                background: "#e5e7eb",
                color: "#374151",
                border: "none",
                borderRadius: "7px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Xóa trắng
            </button>
          </div>
        </form>
      </div>

      {/* Bảng */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
              margin: 0,
            }}
          >
            Danh sách sản phẩm
            <span
              style={{
                marginLeft: "10px",
                background: "#eff6ff",
                color: "#2563eb",
                borderRadius: "20px",
                padding: "2px 10px",
                fontSize: "13px",
              }}
            >
              {products?.docs?.length || 0} sản phẩm
            </span>
          </h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {[
                  "ID",
                  "Tên sản phẩm",
                  "Ảnh",
                  "Giá",
                  "Mô tả",
                  "Thông số",
                  "Kho",
                  "Tình trạng",
                  "Thương hiệu",
                  "Danh mục",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 14px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#6b7280",
                      fontSize: "13px",
                      borderBottom: "1px solid #e5e7eb",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products?.docs?.map((product, idx) => (
                <tr
                  key={product._id}
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "#f9fafb",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#eff6ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      idx % 2 === 0 ? "#fff" : "#f9fafb")
                  }
                >
                  <td
                    style={{
                      padding: "10px 14px",
                      color: "#9ca3af",
                      fontSize: "12px",
                      maxWidth: "80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product._id}
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      fontWeight: "500",
                      color: "#111827",
                    }}
                  >
                    {product.productName}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <img
                      src={product.image}
                      alt={product.productName}
                      width="60"
                      height="60"
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      color: "#2563eb",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {Number(product.price).toLocaleString("vi-VN")}₫
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      color: "#6b7280",
                      maxWidth: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.description}
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      color: "#6b7280",
                      maxWidth: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.techSpecs}
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      textAlign: "center",
                      fontWeight: "600",
                      color: product.quantityStock > 0 ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {product.quantityStock}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background:
                          product.status === "còn bán" ? "#dcfce7" : "#fee2e2",
                        color:
                          product.status === "còn bán" ? "#16a34a" : "#dc2626",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>
                    {brands.find(
                      (b) => b._id === (product.brandId?._id || product.brandId)
                    )?.brandName || "—"}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>
                    {categories.find(
                      (c) =>
                        c._id ===
                        (product.categoryId?._id || product.categoryId)
                    )?.categoryName || "—"}
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{
                        padding: "6px 12px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                        marginRight: "6px",
                      }}
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() =>
                        handleRow(
                          product._id,
                          product.productName,
                          product.price,
                          product.techSpecs,
                          product.description,
                          product.image,
                          product.quantityStock,
                          product.status,
                          product.brandId?._id || product.brandId,
                          product.categoryId?._id || product.categoryId,
                          product.colors,
                          product.images
                        )
                      }
                      style={{
                        padding: "6px 12px",
                        background: "#fef3c7",
                        color: "#d97706",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
