import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Router from "./routes/Routes";
import useAuth from "./hooks/useAuth";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { interceptor, setHeaders } from "./interceptor/interceptor";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  axios.interceptors.request.use((req) => {
    const decoded = auth;
    const tokenExpiration = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    if (now >= tokenExpiration) {
      navigate("/login");
    }
    return req;
  });

  axios.interceptors.response.use((res) => {
    const decoded = auth;
    const tokenExpiration = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    if (now >= tokenExpiration) {
      navigate("/login");
    }
    return res;
  });

  useEffect(() => {
    interceptor();

    const token = localStorage.getItem("token");

    if (token?.length) {
      const decoded = jwt_decode(token);
      const tokenExpiration = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      if (now >= tokenExpiration) {
        navigate("/login");
      } else {
        setHeaders(token);
      }
      setAuth(decoded);
      if (decoded.ROLE === "ADMIN" || decoded.ROLE === "STAFF") {
        navigate("/company-list");
      } else if (decoded.ROLE === "STUDENT") {
        navigate(`/students/${decoded.EMAIL}`);
      } else {
        navigate("/login");
      }
    } else {
      navigate(`/login`);
    }
  }, []);

  return (
    <>
      <Router />
    </>
  );
}

export default App;
