import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Resturants from "./components/Resturants";
import AdminPanel from "./components/Admin/AdminPanel";
import ResturantUpload from "./components/Admin/ResturantUpload";
import Login from "./components/Admin/Login";
import SignIn from "./components/Admin/SignIn";
import Users from "./components/Admin/Users";
function App() {
  const [isAuthenticated, setISAuthenticated] = useState(false);
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth) {
      setISAuthenticated(JSON.parse(storedAuth));
    }
  }, []);
  const handleAuth = () => {
    const newState = !isAuthenticated;
    setISAuthenticated(newState);
    localStorage.setItem("isAuthenticated", JSON.stringify(newState));
  };
  const handleLogout = () => {
    setISAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navbar />}></Route>
        <Route path="/resturants" element={<Resturants />} />
        <Route path="/admin" element={<Login />} />
        <Route
          path="/upload"
          element={isAuthenticated ? <ResturantUpload /> : <SignIn />}
        />
        <Route
          path="/users"
          element={isAuthenticated ? <Users /> : <SignIn />}
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AdminPanel handleLogout={handleLogout} />
            ) : (
              <SignIn handleAuth={handleAuth} />
            )
          }
        />
      </Routes>
    </div>
  );
}
export default App;
