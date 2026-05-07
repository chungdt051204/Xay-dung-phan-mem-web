/* eslint-disable react-hooks/set-state-in-effect */
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import AppContext from "../components/AppContext";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import fetchApi from "../service/api";
import { api } from "../App";
import { toast } from "react-toastify";
import "../style/Cart.css";
import "../style/PaymentDialog.css";

export default function Cart() {
  const { isLoading, isLogin, me, refresh, setRefresh } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [myCart, setMyCart] = useState(null);
  const [itemIdsSelected, setItemIdsSelected] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const formDialog = useRef();

  const totalAmount = () => {
    let sum = 0;
    myCart?.items?.length > 0 &&
      myCart?.items?.forEach((value) => {
        if (itemIdsSelected.includes(value._id))
          sum = sum + value.productId.price * value.quantity;
      });
    return sum;
  };

  const totalAmountSelectedItems = () => {
    let sum = 0;
    selectedItems?.forEach((value) => {
      sum = sum + value.productId.price * value.quantity;
    });
    return sum;
  };

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
      fetchApi({ url: `${api}/cart`, setData: setMyCart });
    }
  }, [me, refresh]);

  useEffect(() => {
    setSelectedItems(
      myCart?.items.filter((value) => itemIdsSelected.includes(value._id)) || []
    );
  }, [itemIdsSelected, myCart]);

  const handleItemSelected = (id) => {
    if (!itemIdsSelected.includes(id))
      setItemIdsSelected((prev) => [...prev, id]);
    else {
      const newItemIds = itemIdsSelected?.filter((item) => item !== id);
      setItemIdsSelected(newItemIds);
    }
  };

  const handleSelectedAll = () => {
    if (itemIdsSelected.length === 0) {
      const allIds = myCart?.items?.map((value) => value._id);
      setItemIdsSelected(allIds || []);
    } else setItemIdsSelected([]);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      fetch(`${api}/cart/${item._id}?action=decrease`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then(() => setRefresh((prev) => prev + 1))
        .catch(() => {});
    }
  };

  const handleIncreaseQuantity = (item) => {
    if (item.quantity >= item.productId.quantityStock) {
      toast.warning(
        `Sản phẩm "${item.productId.productName}" chỉ còn ${item.productId.quantityStock} cái`
      );
      return;
    }
    fetch(`${api}/cart/${item._id}?action=increase`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(() => setRefresh((prev) => prev + 1))
      .catch(() => {});
  };

  const handleDelete = (id) => {
    fetch(`${api}/cart/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(({ message }) => {
        toast.success(message);
        setRefresh((prev) => prev + 1);
      });
  };

  const handleDeleteAll = () => {
    if (itemIdsSelected.length > 0) {
      fetch(`${api}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemIds: itemIdsSelected }),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then(({ message }) => {
          toast.success(message);
          setRefresh((prev) => prev + 1);
        });
    }
  };

  const handleOpenDialog = () => {
    if (itemIdsSelected.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm để xác nhận thanh toán");
      return;
    }
    formDialog.current.showModal();
  };

  // 2. Hàm xử lý đặt hàng tối ưu hóa luồng redirect
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    const loadId = toast.loading("Đang khởi tạo đơn hàng...");

    fetch(`${api}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        fullname,
        address,
        phone,
        paymentMethod,
        total: totalAmount(),
        items: selectedItems,
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(({ message, url }) => {
        toast.dismiss(loadId);
        if (paymentMethod === "cod") {
          toast.success(message);
          formDialog.current.close();
          setRefresh((prev) => prev + 1);
        }
        // 3. Đối với thanh toán online: Thông báo rõ ràng trước khi chuyển hướng
        if (paymentMethod === "online" && url) {
          toast.info("Đang chuyển hướng đến cổng thanh toán an toàn...");
          // Trì hoãn một chút để trình duyệt không coi đây là hành động pop-up độc hại
          setTimeout(() => {
            window.location.href = url;
          }, 1000);
        }
      })
      .catch(async (err) => {
        toast.dismiss(loadId);
        formDialog.current.close();
        const errJson = await err.json().catch(() => ({}));
        toast.error(errJson.message || "Lỗi hệ thống");
      });
  };

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1>Giỏ hàng của bạn</h1>
        </div>
        <div className="cart-content">
          <ul className="cart-items">
            {myCart?.items.length > 0 ? (
              myCart?.items.map((item) => (
                <li key={item._id} className="item">
                  <input
                    checked={itemIdsSelected.includes(item._id)}
                    onChange={() => handleItemSelected(item._id)}
                    type="checkbox"
                  />
                  <img src={item.productId.image} alt="product" />
                  <div className="item-info">
                    <p className="item-name">{item.productId.productName}</p>
                    <p className="item-price">
                      {item.productId.price.toLocaleString()}đ
                    </p>
                    <p className="item-des">{item.productId.description}</p>
                    <div className="quantity-control">
                      <button onClick={() => handleDecreaseQuantity(item)}>
                        -
                      </button>
                      <input
                        style={{ width: "25px" }}
                        type="text"
                        value={item.quantity}
                        readOnly
                      />
                      <button onClick={() => handleIncreaseQuantity(item)}>
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="remove"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </li>
              ))
            ) : (
              <p>Không có sản phẩm để hiển thị</p>
            )}
          </ul>
          {myCart?.items?.length > 0 && (
            <div className="cart-summary">
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <div>
                  <input
                    checked={
                      myCart?.items?.length > 0 &&
                      itemIdsSelected.length === myCart?.items?.length
                    }
                    onChange={handleSelectedAll}
                    type="checkbox"
                  />{" "}
                  Chọn tất cả
                </div>
                <button onClick={handleDeleteAll} className="checkout-btn">
                  Xóa
                </button>
              </div>
              <h4>Tổng tiền: {totalAmount().toLocaleString()} VNĐ</h4>
              <button onClick={handleOpenDialog} className="checkout-btn">
                Thanh toán
              </button>
            </div>
          )}
        </div>
      </div>

      <dialog ref={formDialog} className="payment-dialog">
        <div className="dialog-header">
          <div className="dialog-header-text">
            <h2>Xác nhận thanh toán</h2>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={() => formDialog.current.close()}
          >
            ✕
          </button>
        </div>
        <form
          className="payment-form"
          method="dialog"
          onSubmit={handleConfirmOrder}
        >
          <div className="dialog-content">
            <div className="products-section">
              <h3>Sản phẩm đặt hàng ({selectedItems.length})</h3>
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th className="quantity-cell">Số lượng</th>
                      <th className="total-cell">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems?.map((value) => (
                      <tr key={value._id}>
                        <td>
                          <div className="product-cell">
                            <img src={value.productId.image} alt="product" />
                            <div>
                              <p className="product-name">
                                {value.productId.productName}
                              </p>
                              <p className="product-desc">
                                {value.productId.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          {value.productId.price.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="quantity-cell">{value.quantity}</td>
                        <td className="total-cell">
                          {(
                            value.productId.price * value.quantity
                          ).toLocaleString("vi-VN")}
                          ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title">Thông tin giao hàng</div>
              <div className="form-group">
                <label>
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  value={fullname}
                  type="text"
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Nhập họ tên"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label>
                  Địa chỉ giao hàng <span className="required">*</span>
                </label>
                <input
                  value={address}
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  value={phone}
                  type="tel"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Phương thức thanh toán <span className="required">*</span>
                </label>
                <div className="payment-methods">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="radio-icon">🚚</span>{" "}
                    <span>Khi nhận hàng</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="radio-icon">💳</span>{" "}
                    <span>Trực tuyến (MoMo)</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="order-summary">
              <div className="summary-row total">
                <span>Tổng thanh toán</span>
                <span className="amount">
                  {totalAmountSelectedItems().toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>
          <div className="dialog-actions">
            <div className="action-btns">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => formDialog.current.close()}
              >
                Hủy
              </button>
              <button type="submit" className="submit-btn">
                Xác nhận đặt hàng →
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <Footer />
    </>
  );
}
