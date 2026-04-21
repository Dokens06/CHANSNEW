import { Card, Typography, Autocomplete, TextField, Button, Box } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { getServices } from "../../providers/list";
import { useAlert } from "../../hooks/useAlert";
import { getAppointmentBookedCountByDate, getDoctorServicesByServiceId } from "../../providers/detail";
import { getCookie } from "../../utils/cookieHelper";
import { createEvent, updateEvent } from "../../providers/create";
import CustomCalendar from "../CustomCalendar";
import dayjs from 'dayjs';
import { PrimaryColor, PrimaryThemeColor } from "../../utils/constant";

const AppointmentForm = ({ onClose, setLoadList, isPopup = false, title = 'Appointment', appointment = {} }) => {
    const { showAlert } = useAlert();
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [appointmentData, setAppointmentData] = useState({
        doctor: null,
        service: null,
        event_date: null,
    });
    const [bookedCount, setBookedCount] = useState(null);
    const [isFetchingBookedCount, setIsFetchingBookedCount] = useState(false);

    const MAX_APPOINTMENTS_PER_DAY = parseInt(import.meta.env.VITE_MAX_APPOINTMENTS_PER_DAY) || 50;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await getServices({ 
                    page: 1, // API might be 1-indexed
                    size: 999 
                });
                setServices(response.data.data.items || []);
            } catch (err) {
                showAlert(err.message, 'error');
            }
        };

        fetchServices();       
    }, []);

    useEffect(() => {
        const updateServiceData = () => {
            if (appointment.id) {
                setAppointmentData(appointment);
            }
        }

        updateServiceData()
    }, [appointment]);

  useEffect(() => {
    const fetchBookedCount = async () => {
      const hasValidDate =
        appointmentData.event_date &&
        dayjs(appointmentData.event_date).isValid();

      if (!hasValidDate) {
        setBookedCount(null);
        return;
      }

      const selectedDate = dayjs(appointmentData.event_date).format("YYYY-MM-DD");

      try {
        setIsFetchingBookedCount(true);
        const response = await getAppointmentBookedCountByDate(selectedDate);
        const nextBookedCount =
          response?.data?.data?.booked_count ??
          response?.data?.booked_count ??
          0;
        setBookedCount(nextBookedCount);
      } catch (err) {
        setBookedCount(null);
        showAlert(err.message, "error");
      } finally {
        setIsFetchingBookedCount(false);
      }
    };

    fetchBookedCount();
  }, [appointmentData.event_date, showAlert]);

  const remainingSlots = bookedCount === null ? null : Math.max(MAX_APPOINTMENTS_PER_DAY - bookedCount, 0);
  const isDateFullyBooked = bookedCount !== null && bookedCount >= MAX_APPOINTMENTS_PER_DAY;
  const isBookedAtEightyPercent = bookedCount !== null && bookedCount >= MAX_APPOINTMENTS_PER_DAY * 0.8;
  const bookedStatusColor = isBookedAtEightyPercent ? "error.main" : "success.main";

  const doctorsList = useMemo(() => {
    return doctors.map((doctor) => ({
      label: doctor.doctor.lastname + ", " + doctor.doctor.firstname,
      id: doctor.doctor.id,
    }));
  }, [doctors]);

  const servicesList = useMemo(() => {
    if (!services) return [];

    const sList = services.map((service) => {
        if (!service) return null;
      return {
        label: service.name,
        id: service.id,
      };
    });

    return sList.filter((service) => service !== null);
  }, [services]);

  const handleServiceChange = async (event, newValue) => {
    const doctors = await getDoctorServicesByServiceId(newValue.id);
    setAppointmentData((prev) => ({ ...prev, service: newValue, doctor: null }));

    setDoctors(doctors.data.data || []);
  };

  const handleDoctorChange = async (event, newValue) => {
    setAppointmentData((prev) => ({ ...prev, doctor: newValue }));
  };

  const handleDateChange = (newValue) => {
    const isCompleteValidDate = newValue && dayjs(newValue).isValid();
    setAppointmentData((prev) => ({
      ...prev,
      event_date: isCompleteValidDate ? newValue : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentData.doctor || !appointmentData.service) {
      showAlert("Please select both medical personnel and service", 'error');
      return;
    }
    if (!appointmentData.event_date) {
      showAlert("Please select a date", 'error');
      return;
    }

    if (appointmentData.event_date.isBefore(dayjs())) {
      showAlert("Please select a date in the future", 'error');
      return;
    }

    if (isDateFullyBooked) {
      showAlert("Selected date is fully booked", "error");
      return;
    }

    try {
      const data = {
          user_id: getCookie( 'user_id'),
          doctor_id: appointmentData.doctor.id,
          service_id: appointmentData.service.id,
          event_date: appointmentData.event_date,
          type: 'appointment'
      }

      let updateRes;

      if (appointment.id) {
        updateRes = await updateEvent(appointment.id, data);
      } else {
        updateRes = await createEvent(data);
      }

      if (updateRes.status === 200 || updateRes.status === 201) {
        const successMessage =
          updateRes?.data?.message ||
          (updateRes.status === 200
            ? "Appointment updated successfully"
            : "Appointment added successfully");
        showAlert(successMessage, "success");
        setAppointmentData({
          doctor: null,
          service: null,
          event_date: null,
        });
        setLoadList(true);
        onClose();
      } else {
        showAlert(updateRes?.data?.message || "Something went wrong", "error");
      }
    } catch (err) {
      showAlert(err.message || "Something went wrong", "error");
    }
  };

  return (
    <Card
      variant="outlined"
      className="max-w-[600px] p-4"
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography variant="h6" gutterBottom>
        Add {title}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
        <Autocomplete
          fullWidth
          options={servicesList}
          value={appointmentData.service}
          onChange={handleServiceChange}
          renderInput={(params) => <TextField {...params} label="Service" />}
          disabled={!!appointment.id}
        />
        <Autocomplete
          fullWidth
          options={doctorsList}
          value={appointmentData.doctor}
          onChange={handleDoctorChange}
          renderInput={(params) => <TextField {...params} label="Medical personnel" />}
          disabled={!!appointment.id}
        />
        <CustomCalendar
          value={appointmentData.event_date}
          onChange={handleDateChange}
          label="Date"
          name="event_date"
          errors={[]}
        />
        {appointmentData.event_date && (
          <Typography variant="body2" sx={{ color: bookedStatusColor }}>
            {isFetchingBookedCount
              ? "Checking booked count..."
              : `Booked: ${bookedCount ?? 0}/${MAX_APPOINTMENTS_PER_DAY} | Remaining: ${remainingSlots ?? MAX_APPOINTMENTS_PER_DAY}`}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          sx={{ ...PrimaryThemeColor }}
          type="submit"
          disabled={isFetchingBookedCount || isDateFullyBooked}
        >
          Save
        </Button>
        {!isPopup && <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={onClose}>
          Cancel
        </Button>}
      </Box>
    </Card>
  );
};

export default AppointmentForm;
