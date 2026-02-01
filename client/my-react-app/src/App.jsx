import { Routes, Route } from "react-router-dom";
import AppContext from "./assets/components/AppContext";
import HomeUser from "./assets/components/HomeUser";
import Login from "./assets/components/Login";
import { useEffect, useState } from "react";
export const api = "http://localhost:3000";
// import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [me, setMe] = useState(null);
  useEffect(() => {
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
  }, [refresh]);
  return (
    <>
      <AppContext.Provider
        value={{ refresh, setRefresh, isLogin, setIsLogin, me, setMe }}
      >
        <Routes>
          <Route path="/" element={<HomeUser />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
