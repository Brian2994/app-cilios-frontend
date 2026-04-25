import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function Clients() {
    const [clients, setClients] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const token = localStorage.getItem("token");

    async function loadClients() {
        const res = await axios.get(API + "/clients", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data);
    }

    async function saveClient() {
        if (!name) return alert("Nome obrigatório");

        if (editingId) {
            // UPDATE
            await axios.patch(
                API + `/clients/${editingId}`,
                { name, phone },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } else {
            // CREATE
            await axios.post(
                API + "/clients",
                { name, phone },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        }

        setName("");
        setPhone("");
        setEditingId(null);
        loadClients();
    }

    function editClient(client: any) {
        setName(client.name);
        setPhone(client.phone);
        setEditingId(client.id);
    }

    async function deleteClient(id: string) {
        if (!confirm("Excluir cliente?")) return;

        await axios.delete(API + `/clients/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        loadClients();
    }

    useEffect(() => {
        loadClients();
    }, []);

    return (
        <div>
            <h2 style={styles.title}>👥 Clientes</h2>

            {/* FORM */}
            <div style={styles.form}>
                <input
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />

                <input
                    placeholder="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={styles.input}
                />

                <button onClick={saveClient} style={styles.primaryButton}>
                    {editingId ? "Atualizar" : "Adicionar"}
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

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                style={styles.editButton}
                                onClick={() => editClient(c)}
                            >
                                Editar
                            </button>

                            <button
                                style={styles.deleteButton}
                                onClick={() => deleteClient(c.id)}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    title: {
        marginBottom: "10px",
    },

    form: {
        display: "flex",
        gap: "10px",
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
    },

    input: {
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "6px",
    },

    primaryButton: {
        background: "#ff4da6",
        color: "#fff",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },

    card: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        background: "#fff",
        borderRadius: "10px",
        marginBottom: "10px",
        alignItems: "center",
    },

    editButton: {
        background: "#ffe0ef",
        color: "#ff4da6",
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
    },

    deleteButton: {
        background: "#ffd6d6",
        color: "#ff4d4d",
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
    },
};