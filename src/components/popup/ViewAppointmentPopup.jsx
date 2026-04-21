import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, Button, Typography } from '@mui/material'
import { PrimaryColor } from '../../utils/constant';
import { getEventById } from '../../providers/detail';
import dayjs from 'dayjs';

const ViewAppointmentPopup = ({ open, handleClose, id }) => {
    const [appointment, setAppointment] = useState({});

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await getEventById(id);
                setAppointment({
                    id: response.data.data.event_id,
                    doctor: {
                        id: response.data.data.doctor_id,
                        label: response.data.data.doctor_lastname + ", " + response.data.data.doctor_firstname,
                    },
                    service: {
                        id: response.data.data.service_id,
                        label: response.data.data.service_name,
                    },
                    event_date: response.data.data.event_date ? dayjs(response.data.data.event_date) : null,
                });
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        }
        fetchEvent();
    }, [id])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >  
            <DialogTitle>Appointment</DialogTitle>
            <DialogContent className='space-y-4'>
                <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>Service</Typography>
                    <Typography variant="body2">{appointment.service?.label}</Typography>
                </Box>
                <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>Medical personnel</Typography>
                    <Typography variant="body2">{appointment.doctor?.label}</Typography>
                </Box>
                <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>Appointment Date</Typography>
                    <Typography variant="body2">{appointment.event_date?.format('MMMM D, YYYY')}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ViewAppointmentPopup