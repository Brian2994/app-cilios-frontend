import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function Services() {
    const [services, setServices] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("60");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    async function loadServices() {
        try {
            const res = await axios.get(API + "/services", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices(res.data);
        } catch (err) {
            alert("Erro ao carregar serviços");
        }
    }

    async function saveService() {
        if (!name.trim()) return alert("Nome obrigatório");

        if (!price || Number(price) <= 0) {
            return alert("Preço inválido");
        }

        const payload = {
            name: name.trim(),
            price: Number(price),
            duration: duration ? Number(duration) : 60,
        };

        try {
            setLoading(true);

            if (editingId) {
                await axios.patch(API + `/services/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(API + "/services", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            resetForm();
            loadServices();
        } catch (err: any) {
            alert(err.response?.data?.message || "Erro ao salvar serviço");
        } finally {
            setLoading(false);
        }
    }

    function editService(service: any) {
        setName(service.name);
        setPrice(service.price.toString());
        setDuration(service.duration.toString());
        setEditingId(service.id);
    }

    async function deleteService(id: string) {
        if (!confirm("Excluir serviço?")) return;

        try {
            await axios.delete(API + `/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Serviço excluído com sucesso");
            loadServices();
        } catch (err) {
            alert("Erro ao excluir");
        }
    }

    function resetForm() {
        setName("");
        setPrice("");
        setDuration("60");
        setEditingId(null);
    }

    useEffect(() => {
        loadServices();
    }, []);

    return (
        <div>
            <h2 style={styles.title}>💇 Serviços</h2>

            {/* FORM */}
            <div style={styles.form}>
                <input
                    placeholder="Nome do serviço"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />

                <input
                    placeholder="Preço (R$)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={styles.input}
                />

                <input
                    placeholder="Duração (min)"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={styles.input}
                />

                <button
                    onClick={saveService}
                    style={styles.primaryButton}
                    disabled={loading}
                >
                    {loading
                        ? "Salvando..."
                        : editingId
                            ? "Salvar alterações"
                            : "Novo serviço"}
                </button>

                {editingId && (
                    <button onClick={resetForm} style={styles.cancelButton}>
                        Cancelar
                    </button>
                )}
            </div>

            {/* LISTA */}
            <div style={{ marginTop: 20 }}>
                {services.length === 0 && (
                    <p style={{ opacity: 0.6 }}>Nenhum serviço cadastrado</p>
                )}

                {services.map((s) => (
                    <div key={s.id} style={styles.card}>
                        <div>
                            <strong style={{ fontSize: "16px" }}>{s.name}</strong>
                            <br />
                            <small>
                                R$ {Number(s.price).toFixed(2)} • {s.duration}min
                            </small>
                        </div>

                        <div style={styles.actions}>
                            <button
                                style={styles.editButton}
                                onClick={() => editService(s)}
                            >
                                Editar
                            </button>

                            <button
                                style={styles.deleteButton}
                                onClick={() => deleteService(s.id)}
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
        flexWrap: "wrap" as const,
    },

    input: {
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        minWidth: "150px",
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

    cancelButton: {
        background: "#eee",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        cursor: "pointer",
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

    actions: {
        display: "flex",
        gap: "10px",
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