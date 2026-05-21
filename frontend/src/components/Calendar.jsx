import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function Calendar({ tasks, onEventClick }) {
  const events = tasks.filter(t => t.deadline && t.status !== "done").map(task => {
    let color = "#3b82f6"; // medium
    if (task.priority === "critical") color = "#ef4444";
    if (task.priority === "high") color = "#f97316";
    if (task.priority === "low") color = "#94a3b8";

    return {
      id: task._id,
      title: task.title,
      start: task.deadline, // assume ISO string
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        task
      }
    };
  });

  return (
    <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-4 shadow-xl overflow-hidden calendar-container">
      <style dangerouslySetInnerHTML={{__html: `
        .calendar-container .fc {
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: #0f172a;
          --fc-neutral-text-color: #f1f5f9;
          --fc-border-color: #334155;
          --fc-button-text-color: #f1f5f9;
          --fc-button-bg-color: #334155;
          --fc-button-border-color: #475569;
          --fc-button-hover-bg-color: #475569;
          --fc-button-hover-border-color: #64748b;
          --fc-button-active-bg-color: #6366f1;
          --fc-button-active-border-color: #6366f1;
          --fc-event-text-color: #ffffff;
          --fc-today-bg-color: rgba(99, 102, 241, 0.1);
        }
        .calendar-container .fc-theme-standard th {
          border-color: #334155;
          padding: 8px 0;
        }
        .calendar-container .fc-theme-standard td {
          border-color: #334155;
        }
        .calendar-container .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700;
          color: #f1f5f9;
        }
        @media (max-width: 640px) {
          .calendar-container .fc-toolbar {
            flex-direction: column;
            gap: 10px;
            align-items: center;
          }
          .calendar-container .fc-toolbar-title {
            font-size: 1.1rem !important;
          }
        }
      `}} />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        events={events}
        eventClick={(info) => {
          if (onEventClick) {
            onEventClick(info.event.extendedProps.task);
          }
        }}
        height="auto"
      />
    </div>
  );
}

export default Calendar;
