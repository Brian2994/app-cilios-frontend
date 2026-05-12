import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Register({ onBack }: any) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hover, setHover] = useState(false);

    async function handleRegister(e: any) {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirm) {
            return setError("Preencha todos os campos");
        }

        if (password.length < 6) {
            return setError("Senha deve ter pelo menos 6 caracteres");
        }

        if (password !== confirm) {
            return setError("Senhas não coincidem");
        }

        try {
            setLoading(true);

            await axios.post(`${API}/auth/register`, {
                name,
                email,
                password,
            });

            alert("Conta criada com sucesso!");
            onBack();
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao registrar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.form}>
                <h2 style={{ color: "#ff4da6", textAlign: "center" }}>
                    Criar conta
                </h2>

                <input
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />

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

                <input
                    placeholder="Confirmar senha"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    style={styles.input}
                />

                {error && (
                    <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
                        {error}
                    </p>
                )}

                <button
                    style={{
                        ...styles.button,
                        opacity: loading ? 0.7 : hover ? 0.9 : 1,
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    disabled={loading}
                >
                    {loading ? "Criando..." : "Criar conta"}
                </button>

                <p style={styles.register}>
                    Já tem conta?{" "}
                    <span style={styles.registerLink} onClick={onBack}>
                        Entrar
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
        boxShadow: "0 10px 25px rgba(255, 77, 166, 0.2)",
    },
    input: {
        padding: "12px",
        border: "1px solid #ffccdf",
        borderRadius: "8px",
    },
    button: {
        padding: "12px",
        background: "linear-gradient(90deg, #ff4da6, #ff80bf)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold" as const,
    },
    register: {
        textAlign: "center" as const,
        fontSize: "14px",
        color: "#666",
    },
    registerLink: {
        color: "#ff4da6",
        fontWeight: "bold",
        cursor: "pointer",
    },
};