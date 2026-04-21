import { useContext } from 'react';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import AnnouncementForm from '../forms/AnnouncementForm'
import { Button } from '@mui/material'
import { LoadListContext } from '../../contexts/LoadListContext';
import { PrimaryColor } from '../../utils/constant';

const AnnouncementPopup = ({ open, handleClose, title = 'Announcement' }) => {
    const { setLoadList } = useContext(LoadListContext);
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >  
            <DialogTitle>{title}</DialogTitle>
            <DialogContent >
                <AnnouncementForm title={title} isPopup={true} onClose={handleClose} setLoadList={setLoadList}/>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AnnouncementPopup