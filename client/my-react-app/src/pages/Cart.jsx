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
  const [formData, setFormData] = useState({
    fullname: "",
    address: "",
    phone: "",
    paymentMethod: "cod",
  });
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const formDialog = useRef();

  //Hàm tính tổng tiền
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

  //Kiểm tra quyền, nếu chưa login thì chuyển hướng về trang chủ
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

  //Lấy dữ liệu giỏ hàng
  useEffect(() => {
    if (me) {
      fetchApi({ url: `${api}/cart`, setData: setMyCart });
    }
  }, [me, refresh]);

  //Hàm lưu danh sách các item được chọn
  useEffect(() => {
    setSelectedItems(
      myCart?.items.filter((value) => itemIdsSelected.includes(value._id)) || []
    );
  }, [itemIdsSelected, myCart]);

  //Hàm chọn/bỏ chọn các item khi tích/bỏ tích checkbox
  const handleItemSelected = (id) => {
    //Nếu trong mảng item id chưa có id của item này thì thêm vào (tích chọn checkbox)
    if (!itemIdsSelected.includes(id))
      setItemIdsSelected((prev) => [...prev, id]);
    //Ngược lại nếu có item id này rồi thì lọc mảng để loại bỏ item đó ra (bỏ tích checkbox)
    else {
      const newItemIds = itemIdsSelected?.filter((item) => item !== id);
      setItemIdsSelected(newItemIds);
    }
  };

  //Hàm tích/bỏ tích tất cả item trong giỏ hàng
  const handleSelectedAll = () => {
    //Nếu mảng item id chưa có phần tử (chưa có checkbox nào được tích), thì set giá trị cho mảng item id bằng id của tất cả item trong giỏ hàng
    //Tất cả checkbox đều được tích
    if (itemIdsSelected.length === 0) {
      myCart?.items?.map((value) => {
        setItemIdsSelected((prev) => [...prev, value._id]);
      });
      //Ngược lại set item id về mảng rỗng (Bỏ tích tất cả checkbox)
    } else setItemIdsSelected([]);
  };

  //Hàm giảm số lượng sản phẩm trong giỏ hàng
  const handleDecreaseQuantity = (item) => {
    //Nếu số lượng item > 1 thì mới làm
    if (item.quantity > 1) {
      fetch(`${api}/cart/${item._id}?action=decrease`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

  //Hàm tăng số lượng sản phẩm trong giỏ hàng
  const handleIncreaseQuantity = (item) => {
    // Kiểm tra số lượng tồn kho, nếu còn hàng thì mới được tăng tiếp
    if (item.quantity >= item.productId.quantityStock) {
      toast.warning(
        `Sản phẩm "${item.productId.productName}" chỉ còn ${item.productId.quantityStock} cái`
      );
      return;
    }
    fetch(`${api}/cart/${item._id}?action=increase`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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

  //Hàm xóa 1 item ra khỏi giỏ hàng
  const handleDelete = (id) => {
    fetch(`${api}/cart/${id}`, {
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

  //Hàm xóa các item được chọn ra khỏi giỏ hàng
  const handleDeleteAll = () => {
    //Phải có ít nhất 1 item được chọn thì mới làm
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

  //Hàm mở form Dialog xác nhận thanh toán
  const handleOpenDialog = () => {
    if (itemIdsSelected.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm để xác nhận thanh toán");
      return;
    }
    formDialog.current.showModal();
  };

  //Hàm xử lý đặt hàng/thanh toán
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
        //Nếu thanh toán online bấm đặt hàng xong thông báo kết quả và đóng form Dialog luôn
        if (paymentMethod === "cod") {
          toast.success(message);
          formDialog.current.close();
          setRefresh((prev) => prev + 1);
        }
        //Nếu thanh toán online thì chuyển hướng đến trang thanh toán online
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
                  <img src={item.productId.image} />
                  <div className="item-info">
                    <p className="item-name">{item.productId.productName}</p>
                    <p className="item-price">
                      {item.productId.price.toLocaleString()}đ
                    </p>
                    <p className="item-des">{item.productId.description}</p>
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
