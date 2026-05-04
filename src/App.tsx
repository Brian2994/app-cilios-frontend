import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [screen, setScreen] = useState<"login" | "register">("login");

  if (!token) {
    if (screen === "login") {
      return (
        <Login
          onLogin={setToken}
          onGoRegister={() => setScreen("register")}
        />
      );
    }

    return <Register onBack={() => setScreen("login")} />;
  }

  return <Layout onLogout={() => setToken(null)} />;
}