import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import ProtectedRoute from '../../routes/ProtectedRoute'
import ServiceList from '../../components/tables/ServiceList'
import ServiceForm from '../../components/forms/ServiceForm'
import { LoadListProvider } from '../../contexts/LoadListContext';
import { PrimaryThemeColor } from '../../utils/constant'
import ServiceFormPopup from '../../components/popup/ServiceFormPopup'

const ServicePage = () => {
  const [loadList, setLoadList] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  return (
    <LoadListProvider>
      <Box className="flex flex-col gap-4">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Services</Typography>
          <Button variant="contained" sx={{ textTransform: 'none', ...PrimaryThemeColor }} onClick={handleOpen}>Add Service</Button>
        </Box>
        <ServiceList loadList={loadList} setLoadList={setLoadList} />
        <ServiceFormPopup open={open} handleClose={handleClose} />
      </Box>
    </LoadListProvider>
  )
}

const ProtectedServicePage = ProtectedRoute(ServicePage);
export default ProtectedServicePage