import { useContext } from 'react';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Button } from '@mui/material'
import { LoadListContext } from '../../contexts/LoadListContext';
import { PrimaryColor } from '../../utils/constant';
import DoctorForm from '../forms/DoctorForm';

const MedicalPersonPopup = ({ open, handleClose }) => {
    const { setLoadList } = useContext(LoadListContext);
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >  
            <DialogTitle>Doctor</DialogTitle>
            <DialogContent >
                <DoctorForm setLoadList={setLoadList} onClose={handleClose} />
            </DialogContent>
            <DialogActions>
                
            </DialogActions>
        </Dialog>
    )
}

export default MedicalPersonPopup