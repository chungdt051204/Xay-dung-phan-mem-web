import { useContext, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
export default function CategoryManager() {
  const { categories, setRefresh } = useContext(AppContext);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIdEdit, setCategoryIdEdit] = useState("");

  const handleRow = (id, name) => {
    setCategoryIdEdit(id);
    setCategoryName(name);
  };

  const handleUpdateCategory = () => {
    if (!categoryIdEdit || !categoryName) {
      toast.error("Vui lòng chọn danh mục và nhập tên danh mục");
      return;
    }
    fetch(`http://localhost:3000/category`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ id: categoryIdEdit, categoryName: categoryName }),
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          setCategoryIdEdit("");
          setCategoryName("");
          toast.success("Cập nhật danh mục thành công");
        }else{
          toast.error("Không thể cập nhật danh mục: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể cập nhật danh mục :", error);
        toast.error("Không thể cập nhật danh mục : " + error.message);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          toast.success("Xóa danh mục thành công");
        }else{
          toast.error("Không thể xóa danh mục: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể xóa danh mục :", error);
        toast.error("Không thể xóa danh mục : " + error.message);
      });
  };

  const handleCreateCategory = () => {
    if(!categoryName){
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
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          setCategoryName("");
          toast.success("Tạo danh mục thành công");
        }else{
          toast.error("Không thể tạo danh mục: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể tạo danh mục :", error);
        toast.error("Không thể tạo danh mục : " + error.message);
      });
  };

  return (
    <div className="page-box">
      <h2>Quản lý loại sản phẩm</h2>
       <h2>Form</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateCategory();
        }}
      >
        <input
          type="text"
          placeholder="Tên danh mục"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <button type="submit" onClick={handleCreateCategory}>
          Thêm
        </button>
        <button type="submit" onClick={handleUpdateCategory}>
          Sửa
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>{category.categoryName}</td>
              <td>
                <button onClick={() => handleDelete(category._id)}>Xóa</button>
                <button
                  onClick={() => handleRow(category._id, category.categoryName)}
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
