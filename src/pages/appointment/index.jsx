import { useState, lazy } from 'react'
import { Box, Typography, Button } from '@mui/material'
import ProtectedRoute from '../../routes/ProtectedRoute'
import AppointmentPopup from '../../components/popup/AppointmentPopup'
import { getCookie } from '../../utils/cookieHelper'
import { LoadListProvider } from '../../contexts/LoadListContext';
import { PrimaryThemeColor } from '../../utils/constant'

const AdminActivityLog = lazy(() => import('./AdminActivityLog'));
const UserActivity = lazy(() => import('./UserActivityLog'));

const AppointmentPage = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <LoadListProvider>
      <Box className="flex flex-col gap-4">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Appointments</Typography>
              {getCookie('user_role') === 'user' && (
                <Button variant="contained" sx={{ textTransform: 'none', ...PrimaryThemeColor }} onClick={handleOpen}>Add Appointment</Button>
              )}
          </Box>
          {getCookie('user_role') === 'user' ? <UserActivity /> : <AdminActivityLog />}
          <AppointmentPopup open={open} handleClose={handleClose} />
      </Box>
    </LoadListProvider>
  )
}

const ProtectedAppointmentPage = ProtectedRoute(AppointmentPage);
export default ProtectedAppointmentPage