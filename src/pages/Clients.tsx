import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Clients() {
    const [clients, setClients] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const mobile = window.innerWidth < 768;
    const s = styles(mobile);

    async function loadClients() {
        const res = await axios.get(API + "/clients", {
            headers: { Authorization: `Bearer ${token}` },
        });

        setClients(res.data);
    }

    async function saveClient() {
        if (!name) return alert("Nome obrigatório");

        try {
            setLoading(true);

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
        } catch (err) {
            alert("Erro ao salvar cliente");
        } finally {
            setLoading(false);
        }
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

    function cancelEdit() {
        setEditingId(null);
        setName("");
        setPhone("");
    }

    useEffect(() => {
        loadClients();
    }, []);

    return (
        <div>
            <h2 style={s.title}>👥 Clientes</h2>

            {/* FORM */}
            <div style={s.form}>
                <input
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={s.input}
                />

                <input
                    placeholder="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={s.input}
                />

                <button
                    onClick={saveClient}
                    style={s.primaryButton}
                    disabled={loading}
                >
                    {loading
                        ? "Salvando..."
                        : editingId
                            ? "Atualizar"
                            : "Adicionar"}
                </button>

                {editingId && (
                    <button
                        onClick={cancelEdit}
                        style={s.cancelButton}
                    >
                        Cancelar
                    </button>
                )}
            </div>

            {/* EMPTY */}
            {clients.length === 0 && (
                <div style={s.empty}>
                    Nenhum cliente cadastrado
                </div>
            )}

            {/* LISTA */}
            <div style={{ marginTop: 20 }}>
                {clients.map((c) => (
                    <div key={c.id} style={s.card}>
                        <div>
                            <strong>{c.name}</strong>
                            <br />
                            <small>{c.phone}</small>
                        </div>

                        <div style={s.actions}>
                            <button
                                style={s.editButton}
                                onClick={() => editClient(c)}
                            >
                                Editar
                            </button>

                            <button
                                style={s.deleteButton}
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

const styles = (mobile: boolean) => ({
    title: {
        marginBottom: "10px",
    },

    form: {
        display: "flex",
        flexDirection: mobile ? ("column" as const) : ("row" as const),
        gap: "10px",
        background: "#fff",
        padding: mobile ? "15px" : "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },

    input: {
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        width: mobile ? "100%" : "auto",
        boxSizing: "border-box" as const,
        outline: "none",
    },

    primaryButton: {
        background: "#ff4da6",
        color: "#fff",
        border: "none",
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold" as const,
        width: mobile ? "100%" : "auto",
    },

    cancelButton: {
        background: "#eee",
        color: "#555",
        border: "none",
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold" as const,
        width: mobile ? "100%" : "auto",
    },

    card: {
        display: "flex",
        flexDirection: mobile ? ("column" as const) : ("row" as const),
        justifyContent: "space-between",
        gap: "15px",
        padding: mobile ? "15px" : "18px",
        background: "#fff",
        borderRadius: "12px",
        marginBottom: "12px",
        alignItems: mobile ? "flex-start" : "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },

    actions: {
        display: "flex",
        flexDirection: mobile ? ("column" as const) : ("row" as const),
        gap: "10px",
        width: mobile ? "100%" : "auto",
    },

    editButton: {
        flex: 1,
        background: "#ffe0ef",
        color: "#ff4da6",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold" as const,
    },

    deleteButton: {
        flex: 1,
        background: "#ffd6d6",
        color: "#ff4d4d",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold" as const,
    },

    empty: {
        marginTop: "20px",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center" as const,
        color: "#888",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },
});