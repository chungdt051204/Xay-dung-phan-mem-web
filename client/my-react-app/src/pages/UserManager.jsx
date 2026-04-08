import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import fetchApi from "../service/api";
import { toast } from "react-toastify";
import { api } from "../App";
import ConfirmDialog from "../components/ConfirmDialog";
import "../style/UserManager.css";
import Pagination from "../components/PaginationButton";

export default function UserManager() {
  const { refresh, setRefresh } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const page = searchParams.get("page");
  const role = searchParams.get("role");
  const id = searchParams.get("id");
  const [users, setUsers] = useState([]);
  const [userWithId, setUserWithId] = useState("");
  const [formUser, setFormUser] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    gender: "chưa chọn",
    dateOfBirth: "",
    avatar: "",
    status: "active",
    loginMethod: "Email thường",
    isVerified: false,
  });
  const formDialog = useRef();
  const confirmDialog = useRef();
  useEffect(() => {
    const params = new URLSearchParams();
    if (page) params.append("_page", page);
    if (role) params.append("role", role);
    fetchApi({
      url: `${api}/user?${params.toString()}&_limit=5`,
      setData: setUsers,
    });
  }, [role, setUsers, refresh, page]);
  useEffect(() => {
    if (id) {
      fetchApi({
        url: `${api}/user?id=${id}`,
        setData: setUserWithId,
      });
    } else {
      setFormUser({
        fullname: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        role: "user",
        gender: "chưa chọn",
        dateOfBirth: "",
        avatar: "",
        status: "active",
        loginMethod: "Email thường",
        isVerified: false,
      });
      formDialog.current.close();
    }
  }, [id]);
  useEffect(() => {
    if (userWithId && id) {
      setFormUser({
        fullname: userWithId?.fullname,
        username: userWithId?.username,
        email: userWithId?.email,
        password: userWithId?.password ?? "",
        phone: userWithId?.phone ?? "",
        role: userWithId?.roles,
        gender: userWithId?.gender,
        dateOfBirth: userWithId?.dateOfBirth ?? "",
        avatar: userWithId?.avatar,
        status: userWithId?.status,
        loginMethod: userWithId?.loginMethod,
        isVerified: userWithId?.isVerified,
      });
      formDialog.current.showModal();
    }
  }, [userWithId, id]);
  const handleRoleSelected = (value) => {
    if (value === "") params.delete("role");
    else params.set("role", value);
    navigate(`?${params.toString()}`);
  };
  const handleOpenDialog = (id) => {
    params.set("id", id);
    navigate(`?${params.toString()}`);
    formDialog.current.showModal();
  };
  const handleOpenConfirmDialog = (id) => {
    fetchApi({
      url: `${api}/user?id=${id}`,
      setData: setUserWithId,
    });
    confirmDialog.current.showModal();
  };
  const handleChangeStatus = () => {
    const status = userWithId?.status === "active" ? "inactive" : "active";
    fetch(`${api}/admin/user?id=${userWithId._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        confirmDialog.current.close();
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  return (
    <div className="user-manager">
      <h2>Quản lý người dùng</h2>
      <div className="user-filter">
        <select
          onChange={(e) => {
            handleRoleSelected(e.target.value);
          }}
        >
          <option value="">Chọn vai trò</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Người dùng</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users?.docs?.map((value) => {
            return (
              <tr key={value._id}>
                <td>
                  <img
                    style={{ borderRadius: "50%", marginLeft: "30px" }}
                    src={value.avatar}
                    alt=""
                    width={70}
                    height={80}
                    referrerPolicy="no-referrer"
                  />
                </td>
                <td>{value.fullname}</td>
                <td>{value.email}</td>
                <td>
                  <span
                    className={`badge ${
                      value.roles === "admin" ? "badge-admin" : "badge-user"
                    }`}
                  >
                    {value.roles}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      value.status === "active"
                        ? "badge-active"
                        : "badge-inactive"
                    }`}
                  >
                    {value.status}
                  </span>
                </td>
                <td>{value.createdAt}</td>
                <td className="user-actions">
                  <button onClick={() => handleOpenDialog(value._id)}>
                    Xem chi tiết
                  </button>
                  {value.roles === "user" && (
                    <button
                      onClick={() => {
                        handleOpenConfirmDialog(value._id);
                      }}
                    >
                      {value.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                    </button>
                  )}
                  {/* <button>
                    {value.roles === "user" ? "Thăng cấp" : "Hạ cấp"}
                  </button> */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination totalPages={users?.totalPages} />
      <dialog className="UserManager-dialog" ref={formDialog}>
        <form className="user-detail">
          <img
            src={formUser.avatar || null}
            alt=""
            className="user-avatar"
            referrerPolicy="no-referrer"
          />
          <div className="user-detail-content">
            <label>Họ và tên:</label>
            <input type="text" readOnly value={formUser.fullname || ""} />

            <label>Tên đăng nhập:</label>
            <input type="text" readOnly value={formUser.username || ""} />

            <label>Email:</label>
            <input type="text" readOnly value={formUser.email || ""} />

            <label>Password:</label>
            <input type="password" readOnly value={formUser.password || ""} />

            <label>Phone:</label>
            <input type="text" readOnly value={formUser.phone || ""} />

            <label>Vai trò:</label>
            <input type="text" readOnly value={formUser.role || ""} />

            <label>Giới tính:</label>
            <input type="text" readOnly value={formUser.gender || ""} />

            <label>Ngày sinh:</label>
            <input
              type="text"
              readOnly
              value={
                formUser.dateOfBirth
                  ? new Date(formUser.dateOfBirth).toLocaleDateString()
                  : ""
              }
            />
            <label>Trạng thái:</label>
            <input type="text" readOnly value={formUser.status || ""} />

            <label>Phương thức đăng nhập:</label>
            <input type="text" readOnly value={formUser.loginMethod || ""} />

            <label>Trạng thái xác thực:</label>
            <input
              type="text"
              readOnly
              value={formUser.isVerified ? "Đã xác thực" : "Chưa xác thực"}
            />
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "right",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    if (newParams.has("id")) newParams.delete("id");
                    return newParams;
                  });
                  formDialog.current.close();
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#e74c3c",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Thoát
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <ConfirmDialog
        ref={confirmDialog}
        content="Bạn có muốn thay đổi trạng thái người dùng này không ?"
        handleClick={handleChangeStatus}
      />
    </div>
  );
}
