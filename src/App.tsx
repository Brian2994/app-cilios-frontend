import { useState } from "react";
import Login from "./pages/Login";
import Layout from "./components/Layout";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return <Layout />;
}