import { useContext, useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Button } from '@mui/material'
import { PrimaryColor } from '../../utils/constant';
import { LoadListContext } from '../../contexts/LoadListContext';
import { getEventById } from '../../providers/detail';
import AppointmentForm from '../forms/AppointmentForm'; 
import dayjs from 'dayjs';

const EditAppointmentPopup = ({ open, handleClose, id }) => {
    const { setLoadList } = useContext(LoadListContext);
    const [appointment, setAppointment] = useState({});

    useEffect(() => {
        const fetchAppointment = async () => {
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
        fetchAppointment();
    }, [id])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >  
            <DialogTitle>Announcement</DialogTitle>
            <DialogContent >
                <AppointmentForm onClose={handleClose} setLoadList={setLoadList} isPopup={true} appointment={appointment}/>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditAppointmentPopup