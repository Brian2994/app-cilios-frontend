import { useEffect, useState } from "react";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

const API = "http://localhost:3000";

export default function Calendar() {
    const [events, setEvents] = useState<any[]>([]);
    const token = localStorage.getItem("token");

    async function loadAppointments() {
        const res = await axios.get(API + "/appointments", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map((a: any) => ({
            id: a.id,
            title: `${a.client.name} • ${a.service?.name}`,
            start: a.date,
            end: new Date(
                new Date(a.date).getTime() + (a.duration ?? 60) * 60000
            ),
        }));

        setEvents(formatted);
    }

    async function handleDelete(eventId: string) {
        if (!confirm("Excluir agendamento?")) return;

        await axios.delete(API + `/appointments/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        loadAppointments();
    }

    function handleEventClick(info: any) {
        handleDelete(info.event.id);
    }

    useEffect(() => {
        loadAppointments();
    }, []);

    return (
        <div style={styles.wrapper}>
            <h2 style={styles.title}>📅 Calendário</h2>

            {/* ESTILO GLOBAL MELHORADO */}
            <style>
                {`
        .fc {
            font-family: Arial, sans-serif;
        }

        /* separa os botões da direita */
        .fc .fc-button-group {
            display: flex;
            gap: 6px; /* 🔥 espaço entre Dia / Semana / Mês */
        }

        /* separa os blocos (esquerda / centro / direita) */
        .fc .fc-toolbar-chunk {
            display: flex;
            gap: 10px;
        }

        /* HEADER */
        .fc-toolbar-title {
            color: #ff4da6;
            font-weight: 700;
            font-size: 20px;
        }

        .fc-button {
            background: #ff4da6 !important;
            border: none !important;
            border-radius: 8px !important;
            font-size: 12px !important;
            padding: 6px 10px !important;
            font-weight: bold !important;
        }

        n.fc-butto:hover {
            background: #ff1a8c !important;
        }

        .fc-button-active {
            background: #ff1a8c !important;
        }

        /* GRID */
        .fc-timegrid-slot {
            height: 55px;
        }

        .fc-timegrid-axis {
            color: #888;
            font-size: 12px;
        }

        /* EVENTOS */
        .fc-event {
            background: linear-gradient(135deg, #ff4da6, #ff80bf) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 4px 6px !important;
            font-size: 12px;
            font-weight: 500;
        }

        .fc-event:hover {
            opacity: 0.9;
            transform: scale(1.02);
        }

        /* AGORA */
        .fc-now-indicator {
            border-color: #ff1a8c;
        }
        `}
            </style>

            <div style={styles.card}>
                <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                    initialView="timeGridWeek"
                    locale={ptBrLocale}
                    events={events}
                    height="75vh"
                    allDaySlot={false}
                    slotMinTime="08:00:00"
                    slotMaxTime="20:00:00"
                    nowIndicator={true}

                    /* 🔥 TOOLBAR PROFISSIONAL */
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "timeGridDay,timeGridWeek,dayGridMonth",
                    }}

                    buttonText={{
                        today: "Hoje",
                        month: "Mês",
                        week: "Semana",
                        day: "Dia",
                    }}

                    eventClick={handleEventClick}
                />
            </div>
        </div>
    );
}

/* =========================
   🎨 UI
========================= */
const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "10px",
    },

    title: {
        fontWeight: "bold",
    },

    card: {
        background: "#fff",
        padding: "15px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    },
};