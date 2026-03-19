import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import fetchApi from "../../service/api";
import { api } from "../../App";
import ConfirmDialog from "../components/ConfirmDialog";
import "../style/BrandManager.css";
import Pagination from "../components/PaginationButton";

export default function BrandManager() {
  const { brands, setBrands, setRefresh } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = searchParams.get("id");
  const page = searchParams.get("page");
  const [brandName, setBrandName] = useState("");
  const [brandWithId, setBrandWithId] = useState("");
  const [err, setErr] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const formDialog = useRef();
  const confirmDialog = useRef();
  useEffect(() => {
    const params = new URLSearchParams();
    if (page) {
      params.append("_page", page);
    }
    fetchApi({
      url: `${api}/brand?${params.toString()}&_limit=10`,
      setData: setBrands,
    });
  }, [page, setBrands]);
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchApi({
        url: `${api}/brand?id=${id}`,
        setData: setBrandWithId,
      });
    } else {
      setIsEdit(false);
      setBrandName("");
    }
  }, [id]);
  useEffect(() => {
    if (brandWithId && id) {
      setBrandName(brandWithId?.brandName);
      formDialog.current.showModal();
    }
  }, [brandWithId, id]);

  const handleOpenDialog = (id) => {
    setIsEdit(true);
    params.set("id", id);
    navigate(`?${params.toString()}`);
    formDialog.current.showModal();
  };
  const handleOpenConfirmDialog = (id) => {
    fetchApi({
      url: `${api}/brand?id=${id}`,
      setData: setBrandWithId,
    });
    confirmDialog.current.showModal();
  };
  const handleUpdateBrand = (e) => {
    e.preventDefault();
    if (!brandName) {
      toast.error("Vui nhập tên thương hiệu");
      return;
    }
    fetch(`${api}/brand`, {
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
        if (err.status === 409) {
          const { message } = await err.json();
          setErr(message);
        }
      });
  };

  const handleDelete = () => {
    fetch(`${api}/brand/${brandWithId._id}`, {
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

  const handleCreateBrand = (e) => {
    e.preventDefault();
    if (!brandName) {
      toast.error("Tên thương hiệu không được để trống");
      return;
    }
    fetch(`${api}/brand`, {
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
        if (err.status === 409) {
          const { message } = await err.json();
          setErr(message);
        }
      });
  };

  return (
    <div className="brand-page">
      <div className="brand-card">
        <div className="brand-header">
          <h2>Quản lý thương hiệu</h2>
          <button
            className="btn-add"
            onClick={() => {
              setIsEdit(false);
              setBrandName("");
              formDialog.current.showModal();
            }}
          >
            + Thêm thương hiệu
          </button>
        </div>

        <dialog ref={formDialog} className="brand-dialog">
          <h2>{isEdit ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}</h2>
          <form
            onSubmit={isEdit ? handleUpdateBrand : handleCreateBrand}
            className="brand-form"
          >
            <input
              type="text"
              placeholder="Tên thương hiệu"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />
            {err && <span style={{ color: "red" }}>{err}</span>}
            <div className="dialog-actions">
              <button
                type="button"
                className="btn-cancel"
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
              <button className="btn-save">Lưu</button>
            </div>
          </form>
        </dialog>

        <div className="brand-table-wrapper">
          <table className="brand-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên thương hiệu</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {brands?.docs?.map((brand, index) => (
                <tr key={brand._id}>
                  <td>{index + 1}</td>
                  <td>{brand.brandName}</td>
                  <td className="action-buttons">
                    <button
                      className="btn-delete"
                      onClick={() => handleOpenConfirmDialog(brand._id)}
                    >
                      Xóa
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleOpenDialog(brand._id)}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination totalPages={brands?.totalPages} />
        </div>

        <ConfirmDialog
          ref={confirmDialog}
          content="Bạn có muốn xóa thương hiệu này không ?"
          handleClick={handleDelete}
        />
      </div>
    </div>
  );
}
