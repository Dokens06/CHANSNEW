import { PrimaryColor } from '../../utils/constant'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import EventCalendarList from '../tables/EventCalendarList'

const EventCalendarPopup = ({ open, handleClose, date, loadData }) => {

    console.log("EventCalendarPopup", loadData);
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >  
            <DialogTitle>Event Calendar - {date}</DialogTitle>
            <DialogContent >
                <EventCalendarList loadList={loadData} />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EventCalendarPopup