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

    const mobile = window.innerWidth < 768;
    const s = styles(mobile);

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
            <h2 style={s.title}>💇 Serviços</h2>

            {/* FORM */}
            <div style={s.form}>
                <input
                    placeholder="Nome do serviço"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={s.input}
                />

                <input
                    placeholder="Preço (R$)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={s.input}
                />

                <input
                    placeholder="Duração (min)"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={s.input}
                />

                <button
                    onClick={saveService}
                    style={s.primaryButton}
                    disabled={loading}
                >
                    {loading
                        ? "Salvando..."
                        : editingId
                            ? "Salvar alterações"
                            : "Novo serviço"}
                </button>

                {editingId && (
                    <button onClick={resetForm} style={s.cancelButton}>
                        Cancelar
                    </button>
                )}
            </div>

            {/* LISTA */}
            <div style={{ marginTop: 20 }}>
                {services.length === 0 && (
                    <p style={s.empty}>Nenhum serviço cadastrado</p>
                )}

                {services.map((service) => (
                    <div key={service.id} style={s.card}>
                        <div>
                            <strong style={{ fontSize: "16px" }}>
                                {service.name}
                            </strong>

                            <br />

                            <small>
                                R$ {Number(service.price).toFixed(2)} • {service.duration}min
                            </small>
                        </div>

                        <div style={s.actions}>
                            <button
                                style={s.editButton}
                                onClick={() => editService(service)}
                            >
                                Editar
                            </button>

                            <button
                                style={s.deleteButton}
                                onClick={() => deleteService(service.id)}
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
        marginBottom: "15px",
    },

    form: {
        display: "flex",
        flexDirection: mobile ? "column" as const : "row" as const,
        gap: "12px",
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
        fontSize: "14px",
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
        border: "none",
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        width: mobile ? "100%" : "auto",
    },

    card: {
        display: "flex",
        flexDirection: mobile ? "column" as const : "row" as const,
        justifyContent: "space-between",
        alignItems: mobile ? "flex-start" as const : "center" as const,
        gap: "15px",
        padding: mobile ? "15px" : "18px",
        background: "#fff",
        borderRadius: "12px",
        marginBottom: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
    },

    actions: {
        display: "flex",
        gap: "10px",
        width: mobile ? "100%" : "auto",
    },

    editButton: {
        flex: mobile ? 1 : undefined,
        background: "#ffe0ef",
        color: "#ff4da6",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
    },

    deleteButton: {
        flex: mobile ? 1 : undefined,
        background: "#ffd6d6",
        color: "#ff4d4d",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
    },

    empty: {
        opacity: 0.6,
        marginTop: "20px",
    },
});