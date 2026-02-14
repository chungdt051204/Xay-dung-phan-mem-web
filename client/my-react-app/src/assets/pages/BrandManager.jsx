import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import fetchApi from "../../service/api";
import api from "../../App";

export default function BrandManager() {
  const { brands, setRefresh } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = searchParams.get("id");
  const [brandName, setBrandName] = useState("");
  const [brandWithId, setBrandWithId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const formDialog = useRef();
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchApi({
        url: `http://localhost:3000/brand?id=${id}`,
        setData: setBrandWithId,
      });
    } else {
      setIsEdit(false);
      setBrandName("");
    }
  }, [id]);
  useEffect(() => {
    if (brandWithId) {
      setBrandName(brandWithId?.brandName);
      formDialog.current.showModal();
    }
  }, [brandWithId]);

  const handleOpenDialog = (id) => {
    setIsEdit(true);
    params.set("id", id);
    navigate(`?${params.toString()}`);
    formDialog.current.showModal();
  };

  const handleUpdateBrand = (e) => {
    e.preventDefault();
    if (!brandName) {
      toast.error("Vui nhập tên thương hiệu");
      return;
    }
    fetch(`http://localhost:3000/brand`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ id: id, brandName: brandName }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setBrandName("");
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
        } else {
          toast.error("Không thể xóa thương hiệu: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể xóa thương hiệu :", error);
        toast.error("Không thể xóa thương hiệu : " + error.message);
      });
  };

  const handleCreateBrand = (e) => {
    e.preventDefault();
    if (!brandName) {
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
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setBrandName("");
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
      <h2>Quản lý thương hiệu</h2>
      <button
        onClick={() => {
          formDialog.current.showModal();
        }}
      >
        Thêm thương hiệu
      </button>
      <dialog ref={formDialog}>
        <h2>{isEdit ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}</h2>
        <form onSubmit={isEdit ? handleUpdateBrand : handleCreateBrand}>
          <input
            type="text"
            placeholder="Tên thương hiệu"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
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
            <th>Tên thương hiệu</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand._id}>
              <td>{brand.brandName}</td>
              <td>
                <button onClick={() => handleDelete(brand._id)}>Xóa</button>
                <button onClick={() => handleOpenDialog(brand._id)}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
