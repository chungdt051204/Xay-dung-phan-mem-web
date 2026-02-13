import { useContext, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
export default function BrandManager() {
  const { brands, setRefresh } = useContext(AppContext);
  const [brandName, setBrandName] = useState("");
  const [brandIdEdit, setBrandIdEdit] = useState("");

  const handleRow = (id, name) => {
    setBrandIdEdit(id);
    setBrandName(name);
  };

  const handleUpdateBrand = () => {
    if (!brandIdEdit || !brandName) {
      toast.error("Vui lòng chọn thương hiệu và nhập tên thương hiệu");
      return;
    }
    fetch(`http://localhost:3000/brand`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ id: brandIdEdit, brandName: brandName }),
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          setBrandIdEdit("");
          setBrandName("");
          toast.success("Cập nhật thương hiệu thành công");
        }else{
          toast.error("Không thể cập nhật thương hiệu: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể cập nhật thương hiệu :", error);
        toast.error("Không thể cập nhật thương hiệu : " + error.message);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/brand/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          toast.success("Xóa thương hiệu thành công");
        }else{
          toast.error("Không thể xóa thương hiệu: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể xóa thương hiệu :", error);
        toast.error("Không thể xóa thương hiệu : " + error.message);
      });
  };

  const handleCreateBrand = () => {
    if(!brandName){
      toast.error("Tên thương hiệu không được để trống");
      return;
    }
    fetch(`http://localhost:3000/brand`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ brandName: brandName }),
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          setBrandName("");
          toast.success("Tạo thương hiệu thành công");
        }else{
          toast.error("Không thể tạo thương hiệu: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể tạo thương hiệu :", error);
        toast.error("Không thể tạo thương hiệu : " + error.message);
      });
  };

  return (
    <div className="page-box">
      <h2>Quản lý thương hiệu</h2>
      <h2>Form</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Tên thương hiệu"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          required
        />
        <button type="submit" onClick={handleCreateBrand}>
          Thêm
        </button>
        <button type="submit" onClick={handleUpdateBrand}>
          Sửa
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thương hiệu</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand._id}>
              <td>{brand._id}</td>
              <td>{brand.brandName}</td>
              <td>
                <button onClick={() => handleDelete(brand._id)}>Xóa</button>
                <button onClick={() => handleRow(brand._id, brand.brandName)}>
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
