import { Card, Typography, TextField, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useAlert } from "../../hooks/useAlert";
import { getCookie } from "../../utils/cookieHelper";
import { createEvent, updateEvent } from "../../providers/create";
import CustomCalendar from "../CustomCalendar";
import dayjs from 'dayjs';
import { PrimaryColor, PrimaryThemeColor } from "../../utils/constant";

const AnnouncementForm = ({ onClose, setLoadList, isPopup = false, title = 'Announcement', event = {} }) => {
    const { showAlert } = useAlert();
    const [announcementData, setAnnouncementData] = useState({
        name: '',
        description: '',
        event_date: null,
    });

    useEffect(() => {
        const updateServiceData = () => {
            if (event.id) {
                setAnnouncementData(event);
            }
        }

        updateServiceData()
    }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcementData.name || !announcementData.description) {
      showAlert("Please enter both name and description", 'error');
      return;
    }
    if (!announcementData.event_date) {
      showAlert("Please select a date", 'error');
      return;
    }

    if (announcementData.event_date.isBefore(dayjs())) {
      showAlert("Please select a date in the future", 'error');
      return;
    }

    try {
        const data = {
            user_id: getCookie( 'user_id'),
            name: announcementData.name,
            description: announcementData.description,
            event_date: announcementData.event_date,
            type: 'event'
        }
        let updateRes;

        if (event.id) {
          updateRes = await updateEvent(event.id, data);
        } else {
          updateRes = await createEvent(data);
        }

        if (updateRes.status === 200 || updateRes.status === 201) {
            showAlert(updateRes.status === 200 ? 'Announcement updated successfully' : 'Announcement added successfully', 'success');
            onClose();
            setLoadList(true);
            setAnnouncementData({
              name: '',
              description: '',
              event_date: null,
            });
        } else {
            showAlert('Something went wrong', 'error')
        }
    } catch (err) {
      showAlert(err.message, 'error');
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

        <TextField
            fullWidth
            label="Title"
            name="name"
            type="text"
            value={announcementData.name}
            onChange={(e) => setAnnouncementData((prev) => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
        />
        <TextField
            fullWidth
            label="Description"
            name="description"
            value={announcementData.description}
            onChange={(e) => setAnnouncementData((prev) => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            required
            rows={3}
        />
        <CustomCalendar
          value={announcementData.event_date}
          onChange={(newValue) => setAnnouncementData((prev) => ({ ...prev, event_date: newValue }))}
          label="Date"
          name="event_date"
          errors={[]}
          enableWeekend={title === 'Announcement'}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="contained" sx={{ ...PrimaryThemeColor }} type="submit">
          Save
        </Button>
        {!isPopup && <Button sx={{ borderColor: PrimaryColor, color: PrimaryColor }} variant="outlined" onClick={onClose}>
          Cancel
        </Button>}
      </Box>
    </Card>
  );
};

export default AnnouncementForm;
