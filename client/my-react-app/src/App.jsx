import { Routes, Route, useSearchParams } from "react-router-dom";
import AppContext from "./assets/components/AppContext";
import HomeUser from "./assets/components/HomeUser";
import Login from "./assets/components/Login";
import { useEffect, useState } from "react";
import Register from "./assets/components/Register";
export const api = "http://localhost:3000";
// import "./App.css";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refresh, setRefresh] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setSearchParams((prev) => {
        prev.delete("token");
      });
    }
    fetch(`${api}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ data }) => {
        setMe(data);
        setIsLogin(true);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  }, [refresh, searchParams, setSearchParams]);
  return (
    <>
      <AppContext.Provider
        value={{ refresh, setRefresh, isLogin, setIsLogin, me, setMe }}
      >
        <Routes>
          <Route path="/" element={<HomeUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
