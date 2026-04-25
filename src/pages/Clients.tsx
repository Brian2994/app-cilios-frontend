import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function Clients() {
    const [clients, setClients] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    // =========================
    // LOAD CLIENTS
    // =========================
    async function loadClients() {
        try {
            const res = await axios.get(API + "/clients", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setClients(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    // =========================
    // CREATE CLIENT
    // =========================
    async function createClient() {
        if (!name) return alert("Nome obrigatório");

        setLoading(true);

        try {
            await axios.post(
                API + "/clients",
                { name, phone },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setName("");
            setPhone("");
            loadClients();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // DELETE CLIENT
    // =========================
    async function deleteClient(id: string) {
        if (!confirm("Excluir cliente?")) return;

        try {
            await axios.delete(API + `/clients/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            loadClients();
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadClients();
    }, []);

    return (
        <div>
            <h2>👥 Clientes</h2>

            {/* FORM */}
            <div style={styles.form}>
                <input
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    placeholder="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <button onClick={createClient}>
                    {loading ? "Salvando..." : "Adicionar"}
                </button>
            </div>

            {/* LISTA */}
            <div style={{ marginTop: 20 }}>
                {clients.map((c) => (
                    <div key={c.id} style={styles.card}>
                        <div>
                            <strong>{c.name}</strong>
                            <br />
                            <small>{c.phone}</small>
                        </div>

                        <button onClick={() => deleteClient(c.id)}>Excluir</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    form: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
    },
    card: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        background: "#fff",
        borderRadius: "8px",
        marginBottom: "10px",
    },
};