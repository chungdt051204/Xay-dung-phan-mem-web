import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import AppContext from "../components/AppContext";
import { api } from "../App";
import fetchApi from "../service/api";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import "../style/DetailProduct.css";
import { toast } from "react-toastify";

export default function DetailProduct() {
  const { isLogin, me, refresh, setRefresh } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const [data, setData] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) return;

    fetchApi({
      url: `${api}/product?productId=${productId}`,
      setData: setData,
    });
  }, [productId]);
  const handleAddCart = () => {
    if (!isLogin) {
      toast.warning("Bạn chưa đăng nhập !!");
      return;
    }

    if (quantity > data.quantityStock) {
      toast.warning(`Sản phẩm chỉ còn ${data.quantityStock} cái`);
      return;
    }

    fetch(`${api}/cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: me?._id,
        productId: data?._id,
        quantity: quantity,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };

  if (!data) {
    return <div className="detail-container">Đang tải sản phẩm...</div>;
  }

  const discountPercent = data.oldPrice
    ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100)
    : 0;

  return (
    <>
      <Navbar />
      <div className="detail-container">
        <h2>{data.productName}</h2>
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

            {/* Quantity */}
            <div className="quantity-box">
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() =>
                  quantity < data.quantityStock && setQuantity(quantity + 1)
                }
                disabled={quantity >= data.quantityStock}
              >
                +
              </button>
            </div>

            <div className="button-group">
              {data.quantityStock <= 0 ? (
                <button
                  className="btn-cart"
                  disabled
                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                >
                  Hết hàng
                </button>
              ) : (
                <button
                  onClick={handleAddCart}
                  className="btn-cart"
                  disabled={quantity > data.quantityStock}
                >
                  {quantity > data.quantityStock
                    ? "Vượt quá số lượng tồn kho"
                    : "Thêm vào giỏ"}
                </button>
              )}
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
                <td>{data.quantityStock}</td>
              </tr>

              <tr>
                <td>Trạng thái</td>
                <td
                  style={{
                    color: data.status === "còn hàng" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {data.quantityStock > 0 ? "Còn hàng" : "Hết hàng"}
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
