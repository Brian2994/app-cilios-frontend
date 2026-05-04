import { useState } from "react";
import Clients from "../pages/Clients";
import Services from "../pages/Services";
import Appointments from "../pages/Appointments";
import Calendar from "../pages/Calendar";
import Dashboard from "../pages/Dashboard";

/* =========================
   🔥 BOTÃO REUTILIZÁVEL
========================= */
function SidebarButton({
  label,
  value,
  current,
  onClick,
}: {
  label: string;
  value: string;
  current: string;
  onClick: (v: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const isActive = current === value;

  return (
    <button
      style={{
        ...styles.button,
        ...(isActive && styles.activeButton),
        opacity: hover && !isActive ? 0.8 : 1,
      }}
      onClick={() => onClick(value)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </button>
  );
}

/* =========================
   🔐 LOGOUT
========================= */
function LogoutButton({ onLogout }: any) {
  const [hover, setHover] = useState(false);

  return (
    <button
      style={{
        ...styles.logout,
        opacity: hover ? 0.8 : 1,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        localStorage.removeItem("token");
        onLogout();
      }}
    >
      Sair
    </button>
  );
}

/* =========================
   🧠 LAYOUT PRINCIPAL
========================= */
export default function Layout({ onLogout }: any) {
  const [page, setPage] = useState("dashboard");
  const token = localStorage.getItem("token");

  let user: any = null;

  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Token inválido");
    }
  }

  function renderPage() {
    if (page === "dashboard") return <Dashboard />;
    if (page === "clients") return <Clients />;
    if (page === "services") return <Services />;
    if (page === "appointments") return <Appointments />;
    if (page === "calendar") return <Calendar />;
    return null;
  }

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.userBox}>
          <h2 style={styles.logo}>💇 Cílios</h2>
          <p style={styles.userName}>{user?.name}</p>
          <small style={styles.userEmail}>{user?.email}</small>
        </div>

        <SidebarButton
          label="📊 Dashboard"
          value="dashboard"
          current={page}
          onClick={setPage}
        />

        <SidebarButton
          label="👤 Clientes"
          value="clients"
          current={page}
          onClick={setPage}
        />

        <SidebarButton
          label="💇 Serviços"
          value="services"
          current={page}
          onClick={setPage}
        />

        <SidebarButton
          label="📅 Agenda"
          value="appointments"
          current={page}
          onClick={setPage}
        />

        <SidebarButton
          label="🗓 Calendário"
          value="calendar"
          current={page}
          onClick={setPage}
        />

        <LogoutButton onLogout={onLogout} />
      </div>

      {/* CONTEÚDO */}
      <div style={styles.content}>{renderPage()}</div>
    </div>
  );
}

/* =========================
   🎨 STYLES
========================= */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "220px",
    background: "linear-gradient(180deg, #ff4da6, #ff80bf)",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },

  logo: {
    marginBottom: "10px",
  },

  content: {
    flex: 1,
    padding: "20px",
    background: "#fff0f6",
  },

  button: {
    background: "#fff",
    color: "#ff4da6",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "left" as const,
    transition: "0.2s",
  },

  activeButton: {
    background: "#ff1a8c",
    color: "#fff",
  },

  logout: {
    marginTop: "auto",
    background: "#fff",
    color: "#ff4da6",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  userBox: {
    marginBottom: "15px",
  },

  userName: {
    fontWeight: "bold",
    margin: 0,
  },

  userEmail: {
    fontSize: "12px",
    opacity: 0.8,
  },
};