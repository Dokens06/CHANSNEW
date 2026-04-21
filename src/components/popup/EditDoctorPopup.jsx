import React, { useContext, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DoctorForm from '../forms/DoctorForm'
import { Button } from '@mui/material'
import { LoadListContext } from '../../contexts/LoadListContext';
import { getDoctorById } from '../../providers/detail';
import { PrimaryColor } from '../../utils/constant'

const EditDoctorPopup = ({ open, handleClose, id }) => {
    const { setLoadList } = useContext(LoadListContext);
    const [doctor, setDoctor] = React.useState({});

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await getDoctorById(id);
                setDoctor(response.data.data);
            } catch (error) {
                console.error('Error fetching service:', error);
            }
        }
        fetchDoctor();
    }, [id])
  return (
    <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
    >  
        <DialogTitle>Doctor</DialogTitle>
        <DialogContent >
            <DoctorForm onClose={handleClose} setLoadList={setLoadList} isPopup={true} doctor={doctor}/>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  )
}

export default EditDoctorPopup