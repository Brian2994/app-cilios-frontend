import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const token = localStorage.getItem("token");

    async function load() {
        const res = await axios.get(API + "/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
        });

        setData(res.data);
    }

    useEffect(() => {
        load();
    }, []);

    if (!data) return <p>Carregando...</p>;

    return (
        <div>
            <h2 style={styles.title}>📊 Dashboard</h2>

            {/* CARDS */}
            <div style={styles.grid}>
                <Card title="Hoje" value={`R$ ${data.todayRevenue.toFixed(2)}`} />
                <Card title="Mês" value={`R$ ${data.monthRevenue.toFixed(2)}`} />
                <Card title="Clientes" value={data.totalClients} />
                <Card title="Agendamentos" value={data.totalAppointments} />
            </div>

            {/* LISTA HOJE */}
            <div style={styles.card}>
                <h3>Hoje</h3>

                {data.todayAppointments.length === 0 && (
                    <p>Nenhum agendamento hoje</p>
                )}

                {data.todayAppointments.map((a: any) => (
                    <div key={a.id} style={styles.item}>
                        <div>
                            <strong>{a.client.name}</strong>
                            <br />
                            <small>{a.service?.name}</small>
                        </div>

                        <div>
                            {new Date(a.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Card({ title, value }: any) {
    return (
        <div style={styles.stat}>
            <small>{title}</small>
            <h2>{value}</h2>
        </div>
    );
}

const styles = {
    title: {
        marginBottom: "15px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "15px",
    },

    stat: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },

    card: {
        marginTop: "20px",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
    },

    item: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
    },
};