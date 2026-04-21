import { useEffect, useState } from "react";
import { useAlert } from "./useAlert";

export const useEventCalendar = (getEventByCalendar, type = 'appointment') => {
    const { showAlert } = useAlert();
    const getMonthRange = () => {
      const from = new Date();
      from.setDate(1);

      const to = new Date();
      to.setMonth(to.getMonth() + 1);
      to.setDate(0);

      return { from, to };
    };
    const [loadList, setLoadList] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [dateFilter, setDateFilter] = useState(getMonthRange());
    const [eventType, setEventType] = useState(type);

    
    useEffect(() => {
      const fetchAppointment = async () => {
          try {
          const response = await getEventByCalendar({ from: dateFilter.from, to: dateFilter.to, type: eventType });
          setLoadList(false);

          setAppointments(response.data.data);
          } catch (error) {
          showAlert(error.message, 'error');
          setLoadList(false);
          }
      }

      fetchAppointment();
    }, [dateFilter, loadList, eventType]);

    const fetchEventsForMonth = (from, to, eventType = type) => {
      setDateFilter({from, to});
      setEventType(eventType);
    }
    

    return {
        loadList,
        setLoadList,
        appointments,
        dateFilter,
        eventType,
        setEventType,
        fetchEventsForMonth
    }
}