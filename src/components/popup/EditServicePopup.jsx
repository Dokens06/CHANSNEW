import React, { useContext, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ServiceForm from '../forms/ServiceForm'
import { Button } from '@mui/material'
import { LoadListContext } from '../../contexts/LoadListContext';
import { getServiceById } from '../../providers/detail';
import { PrimaryColor } from '../../utils/constant'

const EditServicePopup = ({ open, handleClose, id }) => {
    const { setLoadList } = useContext(LoadListContext);
    const [service, setService] = React.useState({});

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await getServiceById(id);
                setService(response.data.data);
            } catch (error) {
                console.error('Error fetching service:', error);
            }
        }
        fetchService();
    }, [id])
  return (
    <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
    >  
        <DialogTitle>Services</DialogTitle>
        <DialogContent >
            <ServiceForm onClose={handleClose} setLoadList={setLoadList} isPopup={true} service={service}/>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  )
}

export default EditServicePopup