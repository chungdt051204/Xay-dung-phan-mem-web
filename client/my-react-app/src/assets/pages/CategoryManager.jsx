import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import { api } from "../../App";
import fetchApi from "../../service/api";
import ConfirmDialog from "../components/ConfirmDialog";
import "../style/CategoryManager.css";

export default function CategoryManager() {
  const { categories, setRefresh } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = searchParams.get("id");
  const [categoryWithId, setCategoryWithId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const formDialog = useRef();
  const confirmDialog = useRef();
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchApi({
        url: `${api}/category?id=${id}`,
        setData: setCategoryWithId,
      });
    } else {
      setIsEdit(false);
      setCategoryName("");
    }
  }, [id]);
  useEffect(() => {
    if (categoryWithId && id) {
      setCategoryName(categoryWithId?.categoryName);
      formDialog.current.showModal();
    }
  }, [categoryWithId, id]);

  const handleOpenDialog = (id) => {
    setIsEdit(true);
    params.set("id", id);
    navigate(`?${params.toString()}`);
    formDialog.current.showModal();
  };
  const handleOpenConfirmDialog = (id) => {
    fetchApi({
      url: `${api}/category?id=${id}`,
      setData: setCategoryWithId,
    });
    confirmDialog.current.showModal();
  };
  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!categoryName) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    fetch(`${api}/category`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ id: id, categoryName: categoryName }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setCategoryName("");
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (newParams.has("id")) newParams.delete("id");
          return newParams;
        });
        formDialog.current.close();
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };

  const handleDelete = () => {
    fetch(`${api}/category/${categoryWithId._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
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
      .catch(async (error) => {
        if (error.status === 400) {
          const { message } = await error.json();
          toast.error(message);
        }
      });
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!categoryName) {
      toast.error("Tên danh mục không được để trống");
      return;
    }
    fetch(`${api}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ categoryName: categoryName }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setCategoryName("");
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (newParams.has("id")) newParams.delete("id");
          return newParams;
        });
        formDialog.current.close();
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };

  return (
  <div className="category-page">
    <div className="category-card">
      <div className="category-header">
        <h2>Quản lý loại sản phẩm</h2>
        <button
          className="category-btn-add"
          onClick={() => {
            setIsEdit(false);
            setCategoryName("");
            formDialog.current.showModal();
          }}
        >
          + Thêm loại
        </button>
      </div>

      <dialog ref={formDialog} className="category-dialog">
        <h2>
          {isEdit ? "Cập nhật loại sản phẩm" : "Thêm loại sản phẩm"}
        </h2>

        <form
          onSubmit={isEdit ? handleUpdateCategory : handleCreateCategory}
          className="category-form"
        >
          <input
            type="text"
            placeholder="Tên danh mục"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />

          <div className="category-dialog-actions">
            <button
              type="button"
              className="category-btn-cancel"
              onClick={() => {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  if (newParams.has("id")) newParams.delete("id");
                  return newParams;
                });
                formDialog.current.close();
              }}
            >
              Hủy
            </button>

            <button className="category-btn-save">Lưu</button>
          </div>
        </form>
      </dialog>

      <div className="category-table-wrapper">
        <table className="category-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id}>
                <td>{index + 1}</td>
                <td>{category.categoryName}</td>
                <td className="category-action-buttons">
                  <button
                    className="category-btn-delete"
                    onClick={() =>
                      handleOpenConfirmDialog(category._id)
                    }
                  >
                    Xóa
                  </button>

                  <button
                    className="category-btn-edit"
                    onClick={() =>
                      handleOpenDialog(category._id)
                    }
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        ref={confirmDialog}
        content="Bạn có muốn xóa loại sản phẩm này không ?"
        handleClick={handleDelete}
      />
    </div>
  </div>
);
}
