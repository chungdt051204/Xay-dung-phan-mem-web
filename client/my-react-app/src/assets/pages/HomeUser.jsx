import { useContext } from "react";
import AppContext from "../components/AppContext";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import ProductCategoryCard from "../components/ProductCategoryCard";
import Banner from "../components/Banner";

export default function HomeUser() {
  const { products } = useContext(AppContext);
  const phones = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Điện thoại"
  );
  console.log(phones);
  const laptops = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Laptop"
  );
  const ipads = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Máy tính bảng"
  );
  const headphones = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "Headphones"
  );
  const televisions = products?.docs?.filter(
    (value) => value.categoryId.categoryName === "TV"
  );
  return (
    <>
      <Navbar />
      <Banner />
      <h2>Điện thoại</h2>
      <ProductCategoryCard data={phones} />
      <h2>Laptop</h2>
      <ProductCategoryCard data={laptops} />
      <h2>Máy tính bảng</h2>
      <ProductCategoryCard data={ipads} />
      <h2>Headphone</h2>
      <ProductCategoryCard data={headphones} />
      <h2>Tivi</h2>
      <ProductCategoryCard data={televisions} />
      <Footer />
    </>
  );
}
