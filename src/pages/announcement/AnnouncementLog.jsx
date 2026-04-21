import { Paper } from '@mui/material'
import { lazy } from 'react'
import { getCookie } from '../../utils/cookieHelper';

const AnnouncementList = lazy(() => import('../../components/tables/AnnouncementList'));

const AnnouncementLog = () => {
  return (
    <Paper sx={{ width: '100%' }}>
      <AnnouncementList userType={getCookie('user_role') === 'admin' ? 'admin' : 'user'} />
    </Paper>
  )
}

export default AnnouncementLog