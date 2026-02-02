import { Link } from "react-router-dom";
import { useContext } from "react";
import AppContext from "./AppContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function HomeUser() {
  return (
    <>
    <Navbar/>
    <Footer/>
    </>
  );
}
