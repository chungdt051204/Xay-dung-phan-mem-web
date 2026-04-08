import { useContext, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppContext from "../components/AppContext";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import ProductCategoryCard from "../components/ProductCategoryCard";
import Banner from "../components/Banner";
import User from "./User";
import { api } from "../App";
import fetchApi from "../service/api";

export default function HomeUser() {
  const headingStyle = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#333",
    margin: "30px 0 15px 0",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
  };
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
            categoryName.replace(/\s+/g, "-").toLowerCase()
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
      fetchApi({
        url: `${api}/product?productName=${encodeURIComponent(searchQuery)}`,
        setData: setFilteredProducts,
      });
    } else {
      setFilteredProducts([]);
    }
  }, [searchParams]);

  const phones = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Điện thoại"
  );

  const laptops = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Laptop"
  );
  const ipads = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Máy tính bảng"
  );
  const headphones = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Headphone"
  );
  const televisions = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "TV"
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
            {filteredProducts?.docs?.length === 0 ? (
              <p>Không tìm thấy sản phẩm phù hợp</p>
            ) : (
              <ProductCategoryCard data={filteredProducts?.docs} />
            )}
          </div>
        </>
      ) : (
        <>
          <Banner />
          <div
            style={{
              maxWidth: "1250px",
              margin: "0 auto",
              padding: "20px",
            }}
          >
            <h2 id="điện-thoại" style={headingStyle}>
              Điện thoại
            </h2>
            <ProductCategoryCard data={phones} />

            <h2 id="laptop" style={headingStyle}>
              Laptop
            </h2>
            <ProductCategoryCard data={laptops} />

            <h2 id="máy-tính-bảng" style={headingStyle}>
              Máy tính bảng
            </h2>
            <ProductCategoryCard data={ipads} />

            <h2 id="headphone" style={headingStyle}>
              Phụ kiện
            </h2>
            <ProductCategoryCard data={headphones} />
            <h2 id="tivi" style={headingStyle}>
              Tivi
            </h2>
            <ProductCategoryCard data={televisions} />
          </div>
        </>
      )}
      <Footer />
    </>
  );
}
