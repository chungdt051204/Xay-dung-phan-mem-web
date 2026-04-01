import { useContext, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppContext from "../components/AppContext";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import ProductCategoryCard from "../components/ProductCategoryCard";
import Banner from "../components/Banner";
import User from "./User";

export default function HomeUser() {
  const { products } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setTimeout(() => {
        const categoryMap = {
          phone: "Điện thoại",
          laptop: "Laptop",
          tablet: "Máy tính bảng",
          headphone: "Headphone",
          tivi: "Tivi",
          phukien: "Phụ kiện",
        };
        const categoryName = categoryMap[category];
        if (categoryName) {
          const element = document.getElementById(
            categoryName.replace(/\s+/g, "-").toLowerCase(),
          );
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 300);
    }
  }, [searchParams]);

  // Handle search
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      const filtered = products?.docs?.filter(
        (product) =>
          product.productName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (product.techSpecs &&
            product.techSpecs
              .toLowerCase()
              .includes(searchQuery.toLowerCase())),
      );
      setFilteredProducts(filtered || []);
    } else {
      setFilteredProducts([]);
    }
  }, [searchParams, products]);

  const phones = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Điện thoại",
  );

  const laptops = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Laptop",
  );
  const ipads = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Máy tính bảng",
  );
  const headphones = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Headphone",
  );
  const televisions = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "TV",
  );
  return (
    <>
      <Navbar />
      <Link to="/users">Bấm vào đây để test chủ đề 2</Link>

      {searchParams.get("search") ? (
        <>
          <Banner />
          <div style={{ padding: "20px" }}>
            <h2>Kết quả tìm kiếm cho: "{searchParams.get("search")}"</h2>
            {filteredProducts.length === 0 ? (
              <p>Không tìm thấy sản phẩm phù hợp</p>
            ) : (
              <ProductCategoryCard data={filteredProducts} />
            )}
          </div>
        </>
      ) : (
        <>
          <Banner />
          <h2 id="điện-thoại">Điện thoại</h2>
          <ProductCategoryCard data={phones} />
          <h2 id="laptop">Laptop</h2>
          <ProductCategoryCard data={laptops} />
          <h2 id="máy-tính-bảng">Máy tính bảng</h2>
          <ProductCategoryCard data={ipads} />
          <h2 id="headphone">Headphone</h2>
          <ProductCategoryCard data={headphones} />
          <h2 id="tivi">Tivi</h2>
          <ProductCategoryCard data={televisions} />
        </>
      )}
      <Footer />
    </>
  );
}
