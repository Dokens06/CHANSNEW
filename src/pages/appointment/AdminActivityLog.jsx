import { Paper } from '@mui/material'
import { lazy } from 'react'

const ActivityLog = lazy(() => import('../../components/tables/ActivityLog'));

const AdminActivityLog = () => {
  return (
    <Paper sx={{ width: '100%' }}>
      <ActivityLog eventType="appointment" userType="admin" />
    </Paper>
  )
}

export default AdminActivityLog