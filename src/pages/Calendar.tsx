import { useEffect, useState } from "react";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

const API = import.meta.env.VITE_API_URL;

export default function Calendar() {
    const [events, setEvents] = useState<any[]>([]);

    const token = localStorage.getItem("token");

    const mobile = window.innerWidth < 768;
    const s = styles(mobile);

    async function loadAppointments() {
        try {
            const res = await axios.get(API + "/appointments", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const formatted = res.data.map((a: any) => ({
                id: a.id,
                title: `${a.client.name} • ${a.service?.name}`,
                start: a.date,
                end: new Date(
                    new Date(a.date).getTime() +
                    (a.service?.duration ?? 60) * 60000
                ),
            }));

            setEvents(formatted);
        } catch (err) {
            alert("Erro ao carregar agenda");
        }
    }

    async function handleDelete(eventId: string) {
        if (!confirm("Excluir agendamento?")) return;

        try {
            await axios.delete(API + `/appointments/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            loadAppointments();
        } catch {
            alert("Erro ao excluir agendamento");
        }
    }

    function handleEventClick(info: any) {
        handleDelete(info.event.id);
    }

    useEffect(() => {
        loadAppointments();
    }, []);

    return (
        <div style={s.wrapper}>
            <h2 style={s.title}>📅 Calendário</h2>

            {/* ESTILO GLOBAL MELHORADO */}
            <style>
                {`
                .fc {
                    font-family: Arial, sans-serif;
                }

                .fc-toolbar {
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .fc-toolbar-title {
                    color: #ff4da6;
                    font-weight: bold;
                    font-size: ${mobile ? "18px" : "22px"};
                }

                .fc .fc-toolbar-chunk {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .fc .fc-button-group {
                    display: flex;
                    gap: 6px;
                }

                .fc-button {
                    background: #ff4da6 !important;
                    border: none !important;
                    border-radius: 8px !important;
                    font-size: 12px !important;
                    padding: 8px 12px !important;
                    font-weight: bold !important;
                    box-shadow: none !important;
                }

                .fc-button:hover {
                    background: #ff1a8c !important;
                }

                .fc-button-active {
                    background: #ff1a8c !important;
                }

                .fc-toolbar.fc-header-toolbar {
                    margin-bottom: 20px;
                }

                .fc-scrollgrid {
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #ffe0ef !important;
                }

                .fc-col-header-cell {
                    background: #fff5fa;
                    padding: 10px 0;
                }

                .fc-timegrid-slot {
                    height: ${mobile ? "45px" : "55px"};
                }

                .fc-timegrid-axis {
                    color: #888;
                    font-size: 12px;
                }

                .fc-event {
                    background: linear-gradient(135deg, #ff4da6, #ff80bf) !important;
                    border: none !important;
                    border-radius: 10px !important;
                    padding: 4px 6px !important;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .fc-event:hover {
                    opacity: 0.9;
                    transform: scale(1.02);
                }

                .fc-now-indicator {
                    border-color: #ff1a8c !important;
                }

                .fc-timegrid-now-indicator-line {
                    border-color: #ff1a8c !important;
                }

                .fc-day-today {
                    background: #fff8fc !important;
                }

                @media (max-width: 768px) {
                    .fc-toolbar {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .fc-toolbar-title {
                        font-size: 18px !important;
                    }

                    .fc-button {
                        font-size: 11px !important;
                        padding: 6px 10px !important;
                    }
                }
                `}
            </style>

            <div style={s.card}>
                <FullCalendar
                    plugins={[
                        timeGridPlugin,
                        interactionPlugin,
                        dayGridPlugin,
                    ]}
                    initialView={
                        mobile ? "timeGridDay" : "timeGridWeek"
                    }
                    locale={ptBrLocale}
                    events={events}
                    height={mobile ? "70vh" : "75vh"}
                    allDaySlot={false}
                    slotMinTime="08:00:00"
                    slotMaxTime="20:00:00"
                    nowIndicator={true}

                    /* 🔥 TOOLBAR PROFISSIONAL */
                    eventClick={handleEventClick}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: mobile
                            ? "timeGridDay,dayGridMonth"
                            : "timeGridDay,timeGridWeek,dayGridMonth",
                    }}
                    buttonText={{
                        today: "Hoje",
                        month: "Mês",
                        week: "Semana",
                        day: "Dia",
                    }}
                />
            </div>
        </div>
    );
}

/* =========================
   🎨 UI
========================= */
const styles = (mobile: boolean) => ({
    wrapper: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "15px",
    },

    title: {
        fontWeight: "bold" as const,
        marginBottom: "5px",
    },

    card: {
        background: "#fff",
        padding: mobile ? "12px" : "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        overflowX: "auto" as const,
    },
});