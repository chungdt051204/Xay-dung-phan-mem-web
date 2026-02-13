import { useContext, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import {toast} from "react-toastify";
export default function ProductManager() {
  const { products,brands,categories, setRefresh } = useContext(AppContext);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState();
  const [productDescription, setProductDescription] = useState("");
  const [productTechSpecs, setProductTechSpecs] = useState("");
  const [productQuantityStock, setProductQuantityStock] = useState();
  const [productStatus, setProductStatus] = useState("");
  const [productBrandId, setProductBrandId] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productColorsText, setProductColorsText] = useState("");
  const [productImagesText, setProductImagesText] = useState("");
  const [productIdEdit, setProductIdEdit] = useState("");

  const handleRow = (id, name, price, techSpecs,description,image, quantityStock,status, brandId, categoryId, colors) => {
    setProductIdEdit(id);
    setProductName(name);
    setProductPrice(price);
    setProductTechSpecs(techSpecs);
    setProductDescription(description);
    setProductImage(image);
    setProductQuantityStock(quantityStock);
    setProductStatus(status);
    setProductBrandId(brandId);
    setProductCategoryId(categoryId);
    setProductColorsText(colors.join(", "));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProduct = () => {
    if(!productIdEdit || !productName || !productPrice || !productTechSpecs || !productDescription || !productImage || !productQuantityStock || !productStatus || !productBrandId || !productCategoryId){
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }
    const productColors = productColorsText.split(",").map(c => c.trim()).filter(c => c !== "");
    const productImages = productImagesText.split(",").map(img => img.trim()).filter(img => img !== "");
    fetch(`http://localhost:3000/product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({id: productIdEdit, productName: productName, price: productPrice, techSpecs: productTechSpecs, description: productDescription, image: productImage, quantityStock: productQuantityStock, status: productStatus, brandId: productBrandId, categoryId: productCategoryId, colors: productColors, images: productImages}),
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          setProductIdEdit("");
          toast.success("Cập nhật sản phẩm thành công");
        }else{
          toast.error("Không thể cập nhật sản phẩm: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể cập nhật sản phẩm :", error);
        toast.error("Không thể cập nhật sản phẩm : " + error.message);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          toast.success("Xóa sản phẩm thành công");
        }else{
          toast.error("Không thể xóa sản phẩm: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể xóa sản phẩm :", error);
        toast.error("Không thể xóa sản phẩm : " + error.message);
      });
  };

  const handleCreateProduct = () => {
    if(!productName || !productPrice || !productTechSpecs || !productDescription || !productImage || !productQuantityStock || !productStatus || !productBrandId || !productCategoryId){
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }
    const productImages = productImagesText.split(",").map(img => img.trim()).filter(img => img !== "");
    const productColors = productColorsText.split(",").map(c => c.trim()).filter(c => c !== "");
    fetch(`http://localhost:3000/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ productName: productName, price: productPrice, techSpecs: productTechSpecs, description: productDescription, image: productImage, quantityStock: productQuantityStock, status: productStatus, brandId: productBrandId, categoryId: productCategoryId, colors: productColors, images: productImages }),
    })
      .then((res) => {
        if (res.ok) {
          setRefresh((prev) => prev + 1);
          toast.success("Tạo sản phẩm thành công");
        }else{
          toast.error("Không thể tạo sản phẩm: " + res.statusText);
        }
      })
      .catch((error) => {
        console.error("Không thể tạo sản phẩm :", error);
        toast.error("Không thể tạo sản phẩm : " + error.message);
      });
  };

  const handleClear = () => {
    setProductIdEdit("");
    setProductName("");
    setProductPrice("");
    setProductTechSpecs("");
    setProductDescription("");
    setProductImage("");
    setProductQuantityStock("");
    setProductStatus("");
    setProductBrandId("");
    setProductCategoryId("");
    setProductColorsText("");
    setProductImagesText("");
  };

  return (
    <div className="page-box">
      <h2>Quản lý sản phẩm</h2>
      <h2>Form sản phẩm</h2>
      <form onSubmit={(e) => {e.preventDefault();handleCreateProduct();}}>
        <input type="text" placeholder="Tên sản phẩm" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        <input type="text" placeholder="Giá sản phẩm" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required />
        <input type="text" placeholder="Thông số kỹ thuật" value={productTechSpecs} onChange={(e) => setProductTechSpecs(e.target.value)} required />
        <input type="text" placeholder="Mô tả" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} required />
        <input type="text" placeholder="Ảnh sản phẩm" value={productImage} onChange={(e) => setProductImage(e.target.value)} required />
        <input type="text" placeholder="Tồn kho" value={productQuantityStock} onChange={(e) => setProductQuantityStock(e.target.value)} required />
        <input type="radio" name="status" value="còn bán" checked={productStatus === "còn bán"} onChange={(e) => setProductStatus(e.target.value)} required /> Còn bán
        <input type="radio" name="status" value="ngừng bán" checked={productStatus === "ngừng bán"} onChange={(e) => setProductStatus(e.target.value)} required /> Ngừng bán
        <select value={productBrandId} onChange={(e) => setProductBrandId(e.target.value)} required >
          <option value="">Chọn thương hiệu</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>{brand.brandName}</option> 
          ))}
        </select>
        <select value={productCategoryId} onChange={(e) => setProductCategoryId(e.target.value)} required >
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.categoryName}</option>
          ))}
        </select>
        <input type="text" placeholder="Màu sắc (ngăn cách bằng dấu phẩy)" value={productColorsText} onChange={(e) => setProductColorsText(e.target.value)}  />
        <input type="text" placeholder="Danh sách ảnh (ngăn cách bằng dấu phẩy)" value={productImagesText} onChange={(e) => setProductImagesText(e.target.value)} />
        <button type="submit" onClick={handleCreateProduct}>Thêm</button> 
        <button type="submit" onClick={handleUpdateProduct}>Sửa</button>
        <button onClick={handleClear}>Clear</button>
      </form>
       <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Ảnh sản phẩm</th>
            <th>Giá</th>
            <th>Mô tả</th>
            <th>Thông số kỹ thuật</th>
            <th>Kho</th>
            <th>Tình trạng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.docs.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.productName}</td>
              <td><img src={product.image} alt={product.productName} width="100" height="100"/></td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>{product.techSpecs}</td>
              <td>{product.quantityStock}</td>
              <td>{product.status}</td>
              <td>
                <button onClick={() => handleDelete(product._id)}>Xóa</button>
                <button onClick={() => handleRow(product._id, product.productName, product.price, product.techSpecs, product.description, product.image, product.quantityStock, product.status, product.brandId, product.categoryId, product.colors)}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
