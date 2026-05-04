import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hover, setHover] = useState(false);

    async function handleLogin(e: any) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:3000/auth/login", {
                email,
                password,
            });

            const token = response.data.access_token;

            // salva token
            localStorage.setItem("token", token);

            // avisa App que logou
            onLogin(token);
        } catch (err: any) {
            setError("Email ou senha inválidos");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h2 style={{ color: "#ff4da6", textAlign: "center" }}>💇 App Cílios</h2>
                <p style={{ textAlign: "center", color: "#666", marginBottom: "10px" }}>Acesse sua conta</p>

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <input
                    placeholder="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                {error && <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>{error}</p>}

                <button
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={{
                        ...styles.button,
                        opacity: loading ? 0.7 : (hover ? 0.9 : 1),
                        transform: hover ? "scale(1.02)" : "scale(1)"
                    }}
                    disabled={loading}
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                <p style={styles.register}>
                    Não tem conta?{" "}
                    <span onClick={() => window.location.href = "/register"}>
                        Criar conta
                    </span>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // 💗 Seguindo o fundo suave do seu layout
        background: "#fff0f6",
    },
    form: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "15px",
        padding: "30px",
        background: "#fff",
        borderRadius: "15px",
        width: "350px",
        boxShadow: "0 10px 25px rgba(255, 77, 166, 0.2)", // Sombra rosada leve
    },
    input: {
        padding: "12px",
        border: "1px solid #ffccdf", // Borda rosa clarinha
        borderRadius: "8px",
        outline: "none",
    },
    button: {
        padding: "12px",
        // 💖 Degradê principal do seu layout
        background: "linear-gradient(90deg, #ff4da6, #ff80bf)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold" as const,
        fontSize: "16px",
        transition: "0.3s",
    },
    register: {
        textAlign: "center" as const,
        fontSize: "14px",
        color: "#666",
        cursor: "pointer",
    },
};