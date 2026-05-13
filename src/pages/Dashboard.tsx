import { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const token = localStorage.getItem("token");

    const mobile = window.innerWidth < 768;
    const s = styles(mobile);

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
            <h2 style={s.title}>📊 Dashboard</h2>

            {/* CARDS */}
            <div style={s.grid}>
                <Card
                    title="Hoje"
                    value={`R$ ${data.todayRevenue.toFixed(2)}`}
                    mobile={mobile}
                    style={s.stat}
                />
                <Card
                    title="Mês"
                    value={`R$ ${data.monthRevenue.toFixed(2)}`}
                    mobile={mobile}
                    style={s.stat}
                />

                <Card
                    title="Clientes"
                    value={data.totalClients}
                    mobile={mobile}
                    style={s.stat}
                />

                <Card
                    title="Agendamentos"
                    value={data.totalAppointments}
                    mobile={mobile}
                    style={s.stat}
                />
            </div>

            {/* 📊 GRÁFICOS */}
            <div style={s.charts}>
                {/* 📈 Faturamento */}
                <div style={s.chartCard}>
                    <h3>Faturamento (7 dias)</h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data.revenueByDay}>
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: "#888" }}
                                tickFormatter={(d) =>
                                    new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" })
                                }
                            />

                            <YAxis tick={{ fontSize: 10, fill: "#888" }} />
                            <Tooltip
                                labelFormatter={(value) => {
                                    return new Date(value + "T12:00:00").toLocaleDateString("pt-BR");
                                }}
                                formatter={(value: any) => {
                                    const amount = Number(value);
                                    return [
                                        amount.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }),
                                        "Total",
                                    ];
                                }}
                                contentStyle={{
                                    background: "#fff",
                                    border: "1px solid #ffe0ef",
                                    borderRadius: "8px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#ff4da6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* 🥇 Serviços */}
                <div style={s.chartCard}>
                    <h3>Serviços mais usados</h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data.topServices}>
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: "#888" }}
                                tickFormatter={(name) =>
                                    name.length > 18 ? name.slice(0, 18) + "..." : name
                                }
                            />

                            <YAxis tick={{ fontSize: 12, fill: "#888" }} />
                            <Tooltip
                                contentStyle={{
                                    background: "#fff",
                                    border: "1px solid #ffe0ef",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar
                                dataKey="total"
                                fill="#ff80bf"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* LISTA HOJE */}
            <div style={s.card}>
                <h3>Hoje</h3>

                {data.todayAppointments.length === 0 && (
                    <p>Nenhum agendamento hoje</p>
                )}

                {data.todayAppointments.map((a: any) => (
                    <div key={a.id} style={s.item}>
                        <div>
                            <strong>{a.client.name}</strong>
                            <br />
                            <small>{a.service?.name}</small>
                        </div>

                        <div>
                            {new Date(a.date).toLocaleTimeString("pt-BR", {
                                timeZone: "America/Sao_Paulo",
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

function Card({ title, value, mobile, style }: any) {
    return (
        <div style={style}>
            <small>{title}</small>
            <h2 style={{ fontSize: mobile ? "20px" : "28px" }}>
                {value}
            </h2>
        </div>
    );
}

const styles = (mobile: boolean) => ({
    title: {
        marginBottom: "15px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)",
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
        padding: mobile ? "15px" : "20px",
        borderRadius: "12px",
    },

    item: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
    },

    charts: {
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
        gap: "20px",
        marginTop: "20px",
    },

    chartCard: {
        background: "#fff",
        padding: mobile ? "15px" : "20px",
        borderRadius: "12px",
    },
});