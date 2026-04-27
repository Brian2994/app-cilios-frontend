import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function Appointments() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    const [clientId, setClientId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [date, setDate] = useState("");

    const [selectedService, setSelectedService] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    async function loadData() {
        try {
            const [a, c, s] = await Promise.all([
                axios.get(API + "/appointments", { headers }),
                axios.get(API + "/clients", { headers }),
                axios.get(API + "/services", { headers }),
            ]);

            setAppointments(a.data);
            setClients(c.data);
            setServices(s.data);
        } catch {
            alert("Erro ao carregar dados");
        }
    }

    function handleServiceChange(id: string) {
        setServiceId(id);
        const service = services.find((s) => s.id === id);
        setSelectedService(service);
    }

    async function createAppointment() {
        if (!clientId || !serviceId || !date) {
            return alert("Preencha todos os campos");
        }

        try {
            setLoading(true);

            await axios.post(
                API + "/appointments",
                {
                    clientId,
                    serviceId,
                    date,
                },
                { headers }
            );

            resetForm();
            loadData();
        } catch (err: any) {
            alert(err.response?.data?.message || "Erro ao agendar");
        } finally {
            setLoading(false);
        }
    }

    async function deleteAppointment(id: string) {
        if (!confirm("Excluir agendamento?")) return;

        await axios.delete(API + `/appointments/${id}`, { headers });
        loadData();
    }

    function resetForm() {
        setClientId("");
        setServiceId("");
        setDate("");
        setSelectedService(null);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            <h2 style={styles.title}>📅 Agenda</h2>

            {/* FORM */}
            <div style={styles.form}>
                <div style={styles.field}>
                    <label>Cliente</label>
                    <select
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                    >
                        <option value="">Selecione</option>
                        {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.field}>
                    <label>Serviço</label>
                    <select
                        value={serviceId}
                        onChange={(e) => handleServiceChange(e.target.value)}
                    >
                        <option value="">Selecione</option>
                        {services.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.field}>
                    <label>Data e Hora</label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                {/* INFO DO SERVIÇO */}
                {selectedService && (
                    <div style={styles.serviceInfo}>
                        💰 R$ {selectedService.price.toFixed(2)}
                        ⏱ {selectedService.duration} min
                    </div>
                )}

                <button
                    onClick={createAppointment}
                    style={styles.primaryButton}
                    disabled={loading}
                >
                    {loading ? "Agendando..." : "Agendar"}
                </button>
            </div>

            {/* LISTA */}
            <div style={styles.list}>
                {appointments.length === 0 && (
                    <p style={{ opacity: 0.6 }}>Nenhum agendamento</p>
                )}

                {appointments.map((a) => (
                    <div key={a.id} style={styles.card}>
                        <div>
                            <strong>{a.client.name}</strong>
                            <br />
                            <small>
                                {a.service?.name} •{" "}
                                {new Date(a.date).toLocaleString()}
                            </small>
                        </div>

                        <button
                            style={styles.deleteButton}
                            onClick={() => deleteAppointment(a.id)}
                        >
                            Excluir
                        </button>
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
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr auto",
        gap: "10px",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        alignItems: "end",
    },

    field: {
        display: "flex",
        flexDirection: "column" as const,
        fontSize: "12px",
    },

    serviceInfo: {
        gridColumn: "span 3",
        background: "#fff0f6",
        padding: "10px",
        borderRadius: "8px",
        color: "#ff4da6",
        fontWeight: "bold",
    },

    primaryButton: {
        background: "#ff4da6",
        color: "#fff",
        border: "none",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },

    list: {
        marginTop: "20px",
    },

    card: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        background: "#fff",
        borderRadius: "12px",
        marginBottom: "10px",
        alignItems: "center",
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