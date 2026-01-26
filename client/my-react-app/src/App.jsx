import { Routes, Route } from "react-router-dom";
import Test from "./Test";
import Home from "./Home";
// import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
