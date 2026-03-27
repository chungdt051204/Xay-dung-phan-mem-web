import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import AppContext from "../components/AppContext";
import React from "react";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import "../style/Cart.css";
import fetchApi from "../../service/api";
import { api } from "../../App";
import { toast } from "react-toastify";
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
    return sum + " " + "VNĐ";
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
      myCart?.items?.map((value) => {
        setItemIdsSelected((prev) => [...prev, value._id]);
      });
    } else setItemIdsSelected([]);
  };
  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      fetch(`${api}/cart?userId=${me?._id}&action=decrease`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: item._id }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ message }) => {
          console.log(message);
          setRefresh((prev) => prev + 1);
        })
        .catch(async (err) => {
          const { message } = await err.json();
          console.log(message);
        });
    }
  };
  const handleIncreaseQuantity = (item) => {
    fetch(`${api}/cart?userId=${me?._id}&action=increase`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId: item._id }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        console.log(message);
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  const handleDelete = (id) => {
    fetch(`${api}/cart?itemId=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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
    }
  };
  const handleOpenDialog = () => {
    if (itemIdsSelected.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm để xác nhận thanh toán");
      return;
    }
    formDialog.current.showModal();
  };
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    fetch(`${api}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        fullname: fullname,
        address: address,
        phone: phone,
        paymentMethod: paymentMethod,
        total: totalAmount(),
        items: selectedItems,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message, url }) => {
        if (paymentMethod === "cod") {
          toast.success(message);
          formDialog.current.close();
          setRefresh((prev) => prev + 1);
        }
        if (paymentMethod === "online") {
          console.log(url);
          window.location.href = url;
        }
      })
      .catch(async (err) => {
        formDialog.current.close();
        if (err.status === 404 || err.status === 400) {
          const { message } = await err.json();
          toast.error(message);
        }
        console.log("Lỗi hệ thống");
      });
  };
  return (
    <>
      <Navbar />

      <div className="cart-page">
        <header className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1>Giỏ hàng của bạn</h1>
        </header>

        <div className="cart-content">
          <ul className="cart-items">
            {myCart?.items.length > 0 ? (
              myCart?.items.map((item) => (
                <li key={item._id} className="cart-item">
                  <input
                    checked={itemIdsSelected.includes(item._id)}
                    onChange={() => handleItemSelected(item._id)}
                    type="checkbox"
                  />
                  <img src={item.productId.image} />
                  <div className="item-info">
                    <p className="item-name">{item.productId.productName}</p>
                    <p className="item-price">
                      {item.productId.price.toLocaleString()}đ
                    </p>
                    <p className="item-desc">{item.productId.description}</p>
                    <p className="item-tech">{item.productId.techSpecs}</p>
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
                  />
                  Chọn tất cả
                </div>
                <button onClick={handleDeleteAll} className="checkout-btn">
                  Xóa
                </button>
              </div>

              <h4>Tổng tiền: {totalAmount() + " " + "VNĐ"} </h4>
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
            <span className="dialog-header-sub">Xác nhận đơn hàng</span>
            <h2>Thanh toán</h2>
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
                            <img
                              src={value.productId.image}
                              alt={value.productId.productName}
                            />
                            <div>
                              <p className="product-name">
                                {value.productId.productName}
                              </p>
                              <p className="product-desc">
                                {value.productId.description}
                              </p>
                              <p className="product-desc">
                                {value.productId.techSpecs}
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
                <label htmlFor="fullname">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  value={fullname}
                  id="fullname"
                  type="text"
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Vui lòng nhập họ tên"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Địa chỉ giao hàng <span className="required">*</span>
                </label>
                <input
                  value={address}
                  id="address"
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Vui lòng nhập địa chỉ"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  value={phone}
                  id="phone"
                  type="tel"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Vui lòng nhập số điện thoại"
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
                      defaultChecked
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="radio-icon">🚚</span>
                    <span>Thanh toán khi nhận hàng</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="radio-icon">💳</span>
                    <span>Thanh toán trực tuyến</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                <span className="amount">{totalAmountSelectedItems()}</span>
              </div>
              {/* <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span className="free-ship">Miễn phí</span>
              </div> */}
              <div className="summary-row total">
                <span>Tổng thanh toán</span>
                <span className="amount">{totalAmountSelectedItems()}</span>
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
                Đặt hàng ngay →
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <Footer />
    </>
  );
}
