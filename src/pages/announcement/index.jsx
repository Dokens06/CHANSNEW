import { useState } from 'react'
import ProtectedRoute from '../../routes/ProtectedRoute'
import { Box, Typography, Button } from '@mui/material'
import { LoadListProvider } from '../../contexts/LoadListContext'
import { getCookie } from '../../utils/cookieHelper'
import AnnouncementPopup from '../../components/popup/AnnouncementPopup'
import AnnouncementLog from './AnnouncementLog'
import { PrimaryThemeColor } from '../../utils/constant'

const AnnouncementPage = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <LoadListProvider>
      <Box className="flex flex-col gap-4">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Announcements</Typography>
              {getCookie('user_role') === 'admin' && (
                <Button variant="contained" sx={{ textTransform: 'none', ...PrimaryThemeColor }} onClick={handleOpen}>Add Announcement</Button>
              )}
          </Box>
          <AnnouncementLog />
          <AnnouncementPopup open={open} handleClose={handleClose} />
      </Box>
    </LoadListProvider>
  )
}

const ProtectedAppointmentPage = ProtectedRoute(AnnouncementPage);
export default ProtectedAppointmentPage