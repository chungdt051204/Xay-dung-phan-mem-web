import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import "../style/User.css";
import { api } from "../../App";

export default function User() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const ID = searchParams.get("id");
  const params = new URLSearchParams(searchParams);
  const [refresh, setRefresh] = useState(0);
  const [users, setUsers] = useState([]);
  const [userWithID, setUserWithID] = useState(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const formDialog = useRef();

  useEffect(() => {
    fetch(`${api}/users`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        console.log(data);
        setUsers(data);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  }, [refresh]);
  useEffect(() => {
    if (ID) {
      setIsEdit(true);
      fetch(`${api}/users/${ID}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then((data) => {
          console.log(data);
          setUserWithID(data);
        })
        .catch(async (err) => {
          const { message } = await err.json();
          console.log(message);
        });
    } else {
      setIsEdit(false);
      setId("");
      setName("");
    }
  }, [ID]);
  useEffect(() => {
    if (userWithID !== null) {
      setId(userWithID?.id);
      setName(userWithID?.name);
      formDialog.current.showModal();
    } else formDialog.current.close();
  }, [userWithID]);
  const handleCreate = (e) => {
    e.preventDefault();
    fetch(`${api}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, name: name }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        formDialog.current.close();
        setId("");
        setName("");
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        if (err.status === 409) {
          const { message } = await err.json();
          setError(message);
        }
      });
  };
  const handleDelete = (id) => {
    fetch(`${api}/users?id=${id}`, {
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
  const handleOpenDialog = (id) => {
    setIsEdit(true);
    params.set("id", id);
    navigate(`?${params.toString()}`);
    formDialog.current.showModal();
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`${api}/users?id=${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (newParams.has("id")) newParams.delete("id");
          return newParams;
        });
        formDialog.current.close();
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        if (err.status === 409) {
          const { message } = await err.json();
          setError(message);
        }
      });
  };
  return (
    <>
      <UserNavbar />
      <div className="user-container">
        <h2>Danh sách người dùng</h2>
        <button
          className="btn-add"
          onClick={() => {
            formDialog.current.showModal();
          }}
        >
          Thêm người dùng
        </button>
        <table border={1} cellSpacing={0}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((value) => {
              return (
                <tr key={value._id}>
                  <td>{value.id}</td>
                  <td>{value.name}</td>
                  <td>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(value.id)}
                    >
                      Xóa
                    </button>
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleOpenDialog(value.id)}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <dialog ref={formDialog}>
          <h3>{isEdit ? "Sửa thông tin người dùng" : "Thêm người dùng"}</h3>
          <form onSubmit={isEdit ? handleUpdate : handleCreate}>
            ID:
            <input
              disabled={isEdit ? true : false}
              type="text"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setError("");
              }}
              placeholder="Mời nhập ID"
              required
            />
            <span style={{ color: "red" }}>{error && error}</span>
            <br />
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mời nhập Name"
              required
            />
            <button className="btn-save">Lưu</button>
            <input
              className="btn-cancel"
              onClick={() => {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  if (newParams.has("id")) newParams.delete("id");
                  return newParams;
                });
                formDialog.current.close();
              }}
              type="button"
              value="Hủy"
            />
          </form>
        </dialog>
      </div>

      <Footer />
    </>
  );
}
