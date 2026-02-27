import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import fetchApi from "../../service/api";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import "../style/DetailProduct.css";

export default function DetailProduct() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const [data, setData] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [selectedVersion, setSelectedVersion] = useState("256GB");
  const [selectedColor, setSelectedColor] = useState("Đen");

  useEffect(() => {
    if (!productId) return;

    fetchApi({
      url: `http://localhost:3000/product?productId=${productId}`,
      setData: (result) => {
        const product = Array.isArray(result) ? result[0] : result;
        setData(product);
      },
    });
  }, [productId]);

  if (!data) {
    return <div className="detail-container">Đang tải sản phẩm...</div>;
  }

  const discountPercent = data.oldPrice
    ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100)
    : 0;

  const totalPrice = data.price * quantity;

  return (
    <>
      <Navbar />
      <div className="detail-container">
        <div className="detail-hero">
          {/* IMAGE */}
          <div className="left-gallery">
            <div className="main-image">
              <img src={data.image} alt={data.productName} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-info">
            <div className="product-title">{data.productName}</div>

            <div className="price-box">
              <div className="price-main">
                {data.price?.toLocaleString("vi-VN")}₫
                {data.oldPrice && (
                  <span className="price-old">
                    {data.oldPrice.toLocaleString("vi-VN")}₫
                  </span>
                )}
              </div>

              {discountPercent > 0 && (
                <div className="discount-badge">-{discountPercent}%</div>
              )}
            </div>

            {/* VERSION */}
            <div className="option-title">Phiên bản</div>
            <div className="option-list">
              {["256GB", "512GB", "1TB"].map((ver) => (
                <div
                  key={ver}
                  className={`option-item ${
                    selectedVersion === ver ? "active" : ""
                  }`}
                  onClick={() => setSelectedVersion(ver)}
                >
                  {ver}
                </div>
              ))}
            </div>

            {/* COLOR */}
            <div className="option-title">Màu sắc</div>
            <div className="option-list">
              {["Đen", "Trắng", "Xanh"].map((color) => (
                <div
                  key={color}
                  className={`option-item ${
                    selectedColor === color ? "active" : ""
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="quantity-box">
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <div className="total-price">
              Tạm tính: {totalPrice.toLocaleString("vi-VN")}₫
            </div>

            <div className="button-group">
              <button className="btn-buy">MUA NGAY</button>
              <button className="btn-cart">Thêm vào giỏ</button>
            </div>
          </div>
        </div>

        {/* ===== CHI TIẾT SẢN PHẨM (ĐÃ ĐỔI) ===== */}
        <div className="description-section">
          <h3>Chi tiết sản phẩm</h3>

          <table className="spec-table">
            <tbody>
              <tr>
                <td>Mô tả</td>
                <td>{data.description}</td>
              </tr>

              <tr>
                <td>Cấu hình</td>
                <td>{data.techSpecs}</td>
              </tr>

              <tr>
                <td>Số lượng tồn kho</td>
                <td>{data.quantityStock} sản phẩm</td>
              </tr>

              <tr>
                <td>Trạng thái</td>
                <td
                  style={{
                    color: data.status === "còn hàng" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {data.status}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
