import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import AppContext from "../components/AppContext";
import React from "react";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import "../style/Cart.css";
import fetchApi from "../../service/api";
import { api } from "../../App";
import { toast } from "react-toastify";

export default function Cart() {
  const { isLoading, isLogin, me, refresh, setRefresh } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [myCart, setMyCart] = useState(null);
  const [itemIdsSelected, setItemIdsSelected] = useState([]);

  const totalAmount = () => {
    let sum = 0;
    myCart?.items?.length > 0 &&
      myCart?.items?.forEach((value) => {
        if (itemIdsSelected.includes(value._id))
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
      fetchApi({ url: `${api}/cart?userId=${me?._id}`, setData: setMyCart });
    }
  }, [me, refresh]);

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
    fetch(`${api}/cart?userId=${me?._id}&itemId=${id}`, {
      method: "DELETE",
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
      fetch(`${api}/cart?userId=${me?._id}`, {
        method: "DELETE",
        headers: {
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
              <button className="checkout-btn">Thanh toán </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
