import { useState } from "react";
import Clients from "../pages/Clients";
import Services from "../pages/Services";

// 👉 componente separado (profissional)
function LogoutButton() {
  const [hover, setHover] = useState(false);

  return (
    <button
      style={{
        marginTop: "auto",
        background: "#fff",
        color: "#ff4da6",
        border: "none",
        padding: "10px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        opacity: hover ? 0.8 : 1,
        transition: "0.2s",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        localStorage.removeItem("token");
        window.location.reload();
      }}
    >
      Sair
    </button>
  );
}

export default function Layout() {
  const [page, setPage] = useState("clients");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* MENU */}
      <div style={styles.sidebar}>
        <h2>💇 Cílios</h2>

        <button style={styles.button} onClick={() => setPage("clients")}>
          Clientes
        </button>

        <button style={styles.button} onClick={() => setPage("services")}>
          Serviços
        </button>

        <button style={styles.button} onClick={() => setPage("appointments")}>
          Agenda
        </button>

        {/* botão separado */}
        <LogoutButton />
      </div>

      {/* CONTEÚDO */}
      <div style={styles.content}>
        {page === "clients" && <Clients />}
        {page === "services" && <Services />}
        {page === "appointments" && <div>Agenda (em breve)</div>}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    background: "linear-gradient(180deg, #ff4da6, #ff80bf)", // 💖 pink principal
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  content: {
    flex: 1,
    padding: "20px",
    background: "#fff0f6", // 💗 fundo leve
  },
  button: {
    background: "#fff",
    color: "#ff4da6",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};