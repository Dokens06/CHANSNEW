import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import ProtectedRoute from '../../routes/ProtectedRoute'
import DoctorsList from '../../components/tables/DoctorsList'
import DoctorForm from '../../components/forms/DoctorForm'
import { PrimaryThemeColor } from '../../utils/constant'
import { LoadListProvider } from '../../contexts/LoadListContext';
import MedicalPersonPopup from '../../components/popup/MedicalPersonPopup'

const DoctorPage = () => {
  const [loadList, setLoadList] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return (
    <LoadListProvider>
      <Box className="flex flex-col gap-4">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Medical Personnel</Typography>
              <Button variant="contained" sx={{ textTransform: 'none', ...PrimaryThemeColor }} onClick={handleOpen}>Add medical personnel</Button>
          </Box>
        <DoctorsList loadList={loadList} setLoadList={setLoadList} />
        <MedicalPersonPopup open={open} handleClose={handleClose} />
      </Box>
    </LoadListProvider>
  )
}

const ProtectedDoctorPage = ProtectedRoute(DoctorPage);
export default ProtectedDoctorPage