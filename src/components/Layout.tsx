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
  closeMenu,
  styles,
}: {
  label: string;
  value: string;
  current: string;
  onClick: (v: string) => void;
  closeMenu?: () => void;
  styles: any;
}) {
  const [hover, setHover] = useState(false);

  const isActive = current === value;

  return (
    <button
      style={{
        ...styles.button,
        ...(isActive ? styles.activeButton : {}),
        opacity: hover && !isActive ? 0.8 : 1,
      }}
      onClick={() => {
        onClick(value);

        if (closeMenu) {
          closeMenu();
        }
      }}
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
function LogoutButton({
  onLogout,
  styles,
}: {
  onLogout: () => void;
  styles: any;
}) {
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
export default function Layout({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [page, setPage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const mobile = window.innerWidth < 768;
  const s = styles(mobile);

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
    <div style={s.container}>
      {/* MENU MOBILE */}
      {mobile && !menuOpen && (
        <button
          style={s.menuButton}
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      )}

      {/* OVERLAY */}
      {mobile && menuOpen && (
        <div
          style={s.overlay}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        style={{
          ...s.sidebar,
          display: mobile
            ? menuOpen
              ? "flex"
              : "none"
            : "flex",
        }}
      >
        <div style={s.userBox}>
          <h2 style={s.logo}>💇 Cílios</h2>

          <p style={s.userName}>{user?.name}</p>

          <small style={s.userEmail}>
            {user?.email}
          </small>
        </div>

        <SidebarButton
          label="📊 Dashboard"
          value="dashboard"
          current={page}
          onClick={setPage}
          closeMenu={() => setMenuOpen(false)}
          styles={s}
        />

        <SidebarButton
          label="👤 Clientes"
          value="clients"
          current={page}
          onClick={setPage}
          closeMenu={() => setMenuOpen(false)}
          styles={s}
        />

        <SidebarButton
          label="💇 Serviços"
          value="services"
          current={page}
          onClick={setPage}
          closeMenu={() => setMenuOpen(false)}
          styles={s}
        />

        <SidebarButton
          label="📅 Agenda"
          value="appointments"
          current={page}
          onClick={setPage}
          closeMenu={() => setMenuOpen(false)}
          styles={s}
        />

        <SidebarButton
          label="🗓 Calendário"
          value="calendar"
          current={page}
          onClick={setPage}
          closeMenu={() => setMenuOpen(false)}
          styles={s}
        />

        <LogoutButton
          onLogout={onLogout}
          styles={s}
        />
      </div>

      {/* CONTEÚDO */}
      <div style={s.content}>
        {renderPage()}
      </div>
    </div>
  );
}

/* =========================
   🎨 STYLES
========================= */
const styles = (mobile: boolean) => ({
  container: {
    display: "flex",
    minHeight: "100vh",
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
    position: "fixed" as const,
    top: 0,
    left: 0,
    height: "100vh",
    boxSizing: "border-box" as const,
    overflowY: "auto" as const,
    zIndex: 999,
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
  },

  logo: {
    marginBottom: "10px",
  },

  content: {
    flex: 1,
    width: "100%",
    padding: mobile
      ? "70px 15px 15px"
      : "20px",
    marginLeft: mobile
      ? "0"
      : "220px",
    background: "#fff0f6",
    minHeight: "100vh",
    boxSizing: "border-box" as const,
  },

  button: {
    background: "#fff",
    color: "#ff4da6",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold" as const,
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
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold" as const,
  },

  userBox: {
    marginBottom: "15px",
  },

  userName: {
    fontWeight: "bold" as const,
    margin: 0,
  },

  userEmail: {
    fontSize: "12px",
    opacity: 0.8,
  },

  menuButton: {
    position: "fixed" as const,
    top: "15px",
    left: "15px",
    zIndex: 1000,
    background: "#ff4da6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "20px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.3)",
    zIndex: 998,
  },
});