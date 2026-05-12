import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

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

    const mobile = window.innerWidth < 768;
    const s = styles(mobile);

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
        const service = services.find((service) => service.id === id);
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
            <h2 style={s.title}>📅 Agenda</h2>

            {/* FORM */}
            <div style={s.form}>
                <div style={s.field}>
                    <label>Cliente</label>
                    <select
                        style={s.select}
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

                <div style={s.field}>
                    <label>Serviço</label>
                    <select
                        style={s.select}
                        value={serviceId}
                        onChange={(e) => handleServiceChange(e.target.value)}
                    >
                        <option value="">Selecione</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={s.field}>
                    <label>Data e Hora</label>
                    <input
                        style={s.input}
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                {/* INFO DO SERVIÇO */}
                {selectedService && (
                    <div style={s.serviceInfo}>
                        💰 R$ {selectedService.price.toFixed(2)}
                        ⏱ {selectedService.duration} min
                    </div>
                )}

                <button
                    onClick={createAppointment}
                    style={s.primaryButton}
                    disabled={loading}
                >
                    {loading ? "Agendando..." : "Agendar"}
                </button>
            </div>

            {/* LISTA */}
            <div style={s.list}>
                {appointments.length === 0 && (
                    <p style={s.empty}>Nenhum agendamento</p>
                )}

                {appointments.map((appointment) => (
                    <div key={appointment.id} style={s.card}>
                        <div style={s.info}>
                            <strong>{appointment.client.name}</strong>

                            <small>
                                {appointment.service?.name}
                            </small>

                            <small>
                                {new Date(appointment.date).toLocaleString()}
                            </small>
                        </div>

                        <div style={s.actions}>
                            <button
                                style={s.deleteButton}
                                onClick={() => deleteAppointment(appointment.id)}
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
        flexWrap: "wrap" as const,
        gap: "12px",
        background: "#fff",
        padding: mobile ? "15px" : "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },

    field: {
        display: "flex",
        flexDirection: "column" as const,
        flex: 1,
        gap: "6px",
        minWidth: mobile ? "100%" : "200px",
        fontSize: "13px",
    },

    input: {
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box" as const,
    },

    select: {
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "14px",
        background: "#fff",
        boxSizing: "border-box" as const,
    },

    serviceInfo: {
        width: "100%",
        background: "#fff0f6",
        padding: "12px",
        borderRadius: "8px",
        color: "#ff4da6",
        fontWeight: "bold" as const,
    },

    primaryButton: {
        background: "#ff4da6",
        color: "#fff",
        border: "none",
        height: "46px",
        padding: mobile ? "0 16px" : "0 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold" as const,
        width: mobile ? "100%" : "fit-content",
        alignSelf: mobile
            ? "stretch" as const
            : "flex-end" as const,
        whiteSpace: "nowrap" as const,
    },

    list: {
        marginTop: "20px",
    },

    card: {
        display: "flex",
        flexDirection: mobile
            ? "column" as const
            : "row" as const,
        justifyContent: "space-between",
        alignItems: mobile
            ? "flex-start" as const
            : "center" as const,
        gap: "15px",
        padding: mobile ? "15px" : "18px",
        background: "#fff",
        borderRadius: "12px",
        marginBottom: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
    },

    info: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "4px",
    },

    actions: {
        display: "flex",
        gap: "10px",
        width: mobile ? "100%" : "auto",
    },

    deleteButton: {
        background: "#ffd6d6",
        color: "#ff4d4d",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        width: mobile ? "100%" : "auto",
    },

    empty: {
        opacity: 0.6,
    },
});