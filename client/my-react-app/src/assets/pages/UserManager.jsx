import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import fetchApi from "../../service/api";
import { toast } from "react-toastify";
import { api } from "../../App";
import ConfirmDialog from "../components/ConfirmDialog";
export default function UserManager() {
  const { refresh, setRefresh, users, setUsers } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const role = searchParams.get("role");
  const id = searchParams.get("id");
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
    if (role) params.append("role", role);
    fetchApi({
      url: `${api}/user?${params.toString()}`,
      setData: setUsers,
    });
  }, [role, setUsers, refresh]);
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
    <div className="page-box">
      <h2>Quản lý người dùng</h2>
      <select
        onChange={(e) => {
          handleRoleSelected(e.target.value);
        }}
      >
        <option value="">Chọn vai trò</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <table>
        <thead>
          <tr>
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
                <td style={{ display: "flex" }}>
                  <img
                    src={value.avatar}
                    alt=""
                    width={50}
                    height={50}
                    referrerPolicy="no-referrer"
                  />
                  <p>{value.fullname}</p>
                </td>
                <td>{value.email}</td>
                <td>{value.roles}</td>
                <td>{value.status}</td>
                <td>{value.createdAt}</td>
                <td>
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
      <dialog ref={formDialog}>
        <form style={{ display: "flex" }}>
          <img src={formUser.avatar} alt="" width={80} height={100} />
          <div>
            <label htmlFor="fullname">Họ và tên:</label>
            <input type="text" readOnly value={formUser.fullname} />
            <br />
            <label htmlFor="username">Tên đăng nhập:</label>
            <input type="text" readOnly value={formUser.username} />
            <br />
            <label htmlFor="email">Email:</label>
            <input type="text" readOnly value={formUser.email} />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" readOnly value={formUser.password} />
            <br />
            <label htmlFor="phone">Phone:</label>
            <input type="text" readOnly value={formUser.phone} />
            <br />
            <label htmlFor="role">Vai trò:</label>
            <input type="text" readOnly value={formUser.role} />
            <br />
            <label htmlFor="gender">Giới tính:</label>
            <input type="text" readOnly value={formUser.gender} />
            <br />
            <label htmlFor="dateOfBirth">Ngày sinh:</label>
            <input
              type="text"
              readOnly
              value={
                formUser.dateOfBirth &&
                new Date(formUser.dateOfBirth).toLocaleDateString()
              }
            />
            <br />
            <label htmlFor="status">Trạng thái:</label>
            <input type="text" readOnly value={formUser.status} />
            <br />
            <label htmlFor="loginMethod">Phương thức đăng nhập:</label>
            <input type="text" readOnly value={formUser.loginMethod} />
            <br />
            <label htmlFor="isVerified">Trạng thái xác thực:</label>
            <input
              type="text"
              readOnly
              value={formUser.isVerified ? "Đã xác thực" : "Chưa xác thực"}
            />
            <br />
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
            >
              Thoát
            </button>
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
