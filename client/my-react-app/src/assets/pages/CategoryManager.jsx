import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import fetchApi from "../../service/api";
import ConfirmDialog from "../components/ConfirmDialog";
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
        url: `http://localhost:3000/category?id=${id}`,
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
      url: `http://localhost:3000/category?id=${id}`,
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
    fetch(`http://localhost:3000/category`, {
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
    fetch(`http://localhost:3000/category/${categoryWithId._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Xóa danh mục thành công");
          confirmDialog.current.close();
          setRefresh((prev) => prev + 1);
        } else {
          toast.error("Không thể xóa danh mục: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể xóa danh mục :", error);
        toast.error("Không thể xóa danh mục : " + error.message);
      });
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!categoryName) {
      toast.error("Tên danh mục không được để trống");
      return;
    }
    fetch(`http://localhost:3000/category`, {
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
    <div className="page-box">
      <h2>Quản lý loại sản phẩm</h2>
      <button
        onClick={() => {
          formDialog.current.showModal();
        }}
      >
        Thêm loại
      </button>
      <dialog ref={formDialog}>
        <h2>{isEdit ? "Cập nhật loại sản phẩm" : "Thêm loại sản phẩm"}</h2>
        <form onSubmit={isEdit ? handleUpdateCategory : handleCreateCategory}>
          <input
            type="text"
            placeholder="Tên danh mục"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
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
            Hủy
          </button>
          <button>Lưu</button>
        </form>
      </dialog>

      <table>
        <thead>
          <tr>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.categoryName}</td>
              <td>
                <button onClick={() => handleOpenConfirmDialog(category._id)}>
                  Xóa
                </button>
                <button onClick={() => handleOpenDialog(category._id)}>
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        ref={confirmDialog}
        content="Bạn có muốn xóa loại sản phẩm này không ?"
        handleClick={handleDelete}
      />
    </div>
  );
}
