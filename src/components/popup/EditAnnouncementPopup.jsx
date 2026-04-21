import { useContext, useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Button } from '@mui/material'
import { PrimaryColor } from '../../utils/constant';
import { LoadListContext } from '../../contexts/LoadListContext';
import { getEventById } from '../../providers/detail';
import AnnouncementForm from '../forms/AnnouncementForm'; 
import dayjs from 'dayjs';

const EditAnnouncementPopup = ({ open, handleClose, id }) => {
    const { setLoadList } = useContext(LoadListContext);
    const [event, setEvent] = useState({});

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await getEventById(id);
                setEvent({
                    id: response.data.data.event_id,
                    name: response.data.data.announcement_name,
                    description: response.data.data.announcement_description,
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
            <DialogTitle>Announcement</DialogTitle>
            <DialogContent >
                <AnnouncementForm onClose={handleClose} setLoadList={setLoadList} isPopup={true} event={event}/>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditAnnouncementPopup