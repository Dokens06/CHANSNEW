import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ServiceListPopup from '../popup/ServiceListPopup'
import { Button } from '@mui/material'
import { PrimaryColor, PrimaryThemeColor } from '../../utils/constant'
import { createDoctorServiceByDoctorId } from '../../providers/create'
import { useAlert } from '../../hooks/useAlert'

const ServicesPopup = ({ open, handleClose, id }) => {
    const { showAlert } = useAlert();
    const [loadList, setLoadList] = useState(false);
    const [actions, setActions] = useState({
        selected: [],
        unselected: [],
    })

    const handleSave = async () => {
        try {
            const response = await createDoctorServiceByDoctorId({
                doctor_id: id,
                selected_service_ids: actions.selected,
                unselected_service_ids: actions.unselected
            });

            if (response.status === 200 || response.status === 201) {
                showAlert(response?.data?.message || 'Services updated successfully', 'success');
                setActions({
                    selected: [],
                    unselected: [],
                });
                setLoadList(true);
                handleClose();
                return;
            }

            showAlert(response?.data?.message || 'Something went wrong', 'error');
        } catch (error) {
            showAlert(error.message || 'Something went wrong', 'error');
        }
    };
  return (
    <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
    >  
        <DialogTitle>Services</DialogTitle>
        <DialogContent >
            <ServiceListPopup loadList={loadList} setLoadList={setLoadList} id={id} actions={actions} setActions={setActions}/>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" sx={{ textTransform: 'none', ...PrimaryThemeColor }} onClick={handleSave}>Save</Button>
            <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  )
}

export default ServicesPopup
