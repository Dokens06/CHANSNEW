import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Activity, useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { getCookie } from "../utils/cookieHelper";
import { TertiaryThemeColor, AnnouncementColor } from "../utils/constant";
import ViewAppointmentPopup from "./popup/ViewAppointmentPopup";
import ViewAnnouncementPopup from "./popup/ViewAnnouncementPopup";
import EventCalendarPopup from "./popup/EventCalendarPopup";
import { getDate } from "../utils/util.helper";
import "../assets/css/event-calendar.css";

const EventCalendar = ({ events, fetchEventsForMonth, eventType = 'appointment' }) => {
  const [isViewAppointment, setIsViewAppointment] = useState(false);
  const [isViewAnnouncement, setIsViewAnnouncement] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [openCalendarList, setOpenCalendarList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarList, setCalendarList] = useState([]);

  const appointmentData = useMemo(() => {
    return events.map((appointment) => {
      if (!appointment) return null;
      
      let color = TertiaryThemeColor.backgroundColor;
      let title = `${appointment.service_name} Appointment – Dr. ${appointment.doctor_lastname}`;

      if (appointment.entity_type === 'event') {
        color = AnnouncementColor
        title = appointment.announcement_name
      }

      if (getCookie('user_role') === 'admin' && appointment.entity_type !== 'event') {
        title = `Dr. ${appointment.doctor_lastname} Appointment to ${appointment.user_gender === "male" ? "Mr." : "Ms."} ${appointment.user_lastname}`;
      }

      return {
        id: appointment.event_id,
        title,
        event_type: appointment.entity_type,
        start_date: appointment.event_date,
        color
      }
    })
  },[events])

  // const [filterType, setFilterType] = useState("all");
  // const [filterBarangay, setFilterBarangay] = useState("all");

  // // Filter events based on type and barangay
  // const filtered = events.filter((evt) => {
  //   return (
  //     (filterType === "all" || evt.event_type === filterType) &&
  //     (filterBarangay === "all" || evt.barangay === filterBarangay)
  //   );
  // });

  const onViewAppointment = (id) => {
      setIdSelected(id);
      setIsViewAppointment(true);
  }

  const handleViewAppointmentClose = () => {
      setIsViewAppointment(false);
  }

  const onViewAnnouncement = (id) => {
      setIdSelected(id);
      setIsViewAnnouncement(true);
  }

  const handleViewAnnouncementClose = () => {
      setIsViewAnnouncement(false);
  }

  const handleOpenCalendarList = (date) => {
    setSelectedDate(date);
    setOpenCalendarList(true);
  }

  const handleCloseCalendarList = () => {
    setOpenCalendarList(false);
    setSelectedDate(null);
  }

  const dateClickHandler = (info) => {
    let clickedDate;

    if (info.dateStr) {
      clickedDate = info.dateStr;
    } else {
      clickedDate = getDate(info.date);
    }

    // Filter events for that date
    const dayEvents = appointmentData.filter((evt) => {
        const eventDate = new Date(evt.start_date);
        const year = eventDate.getFullYear();
        const month = String(eventDate.getMonth() + 1).padStart(2, "0");
        const day = String(eventDate.getDate()).padStart(2, "0");
        // console.log(`${year}-${month}-${day}` === clickedDate, `${year}-${month}-${day}`, clickedDate)
        return `${year}-${month}-${day}` === clickedDate;
    });

    setCalendarList(dayEvents);
    handleOpenCalendarList(clickedDate);

    return "none";
  }

  return (
    <>
      <Box sx={{ p: 2 }}>
        {/* Calendar */}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dayCellClassNames={() => "clickable-day"}
          dayMaxEvents={3}
          events={appointmentData.map((evt) => ({
            id: evt.id,
            title: evt.title,
            start: evt.start_date,
            backgroundColor: evt.color,
            eventType: evt.event_type
          }))}
          datesSet={(info) => {
            const from = info.start;
            const to = info.end;

            fetchEventsForMonth(from, to, eventType);
          }}
          dayCellContent={(arg) => {
            return (
              <div>
                <p>{arg.dayNumberText}</p>

                
              </div>
            );
          }}
          moreLinkClick={dateClickHandler}
          dateClick={dateClickHandler}
          eventContent={(arg) => {
            return (
              <Button
                disableElevation
                disableRipple
                fullWidth
                className="text-left"
                sx={{ backgroundColor: arg.event.backgroundColor, padding: 0, borderRadius: 0, margin: 0 }}
                onClick={() => {
                  const eventType = arg.event.extendedProps.eventType;
                  if (eventType === 'appointment') {
                    onViewAppointment(arg.event.id);
                  } else {
                    onViewAnnouncement(arg.event.id);
                  }
                }}>
                <Typography
                  variant="body2"
                  className={`capitalize w-full overflow-hidden text-white px-1`}
                  title={arg.event.title}
                >{arg.event.title}</Typography>
              </Button>
            )
          }}
        />
      </Box>

      <Activity mode={isViewAnnouncement ? "visible" : "hidden"}>
          <ViewAnnouncementPopup open={isViewAnnouncement} handleClose={handleViewAnnouncementClose} id={idSelected} />
      </Activity>
      <Activity mode={isViewAppointment ? "visible" : "hidden"}>
          <ViewAppointmentPopup open={isViewAppointment} handleClose={handleViewAppointmentClose} id={idSelected} />
      </Activity>
      <Activity mode={openCalendarList ? "visible" : "hidden"}>
          <EventCalendarPopup open={openCalendarList} handleClose={handleCloseCalendarList} date={selectedDate} loadData={calendarList} />
      </Activity>
    </>
  );
}

export default EventCalendar;