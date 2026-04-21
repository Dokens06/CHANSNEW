import { Paper, Typography } from '@mui/material'
import { lazy } from 'react'

const ActivityLog = lazy(() => import('../../components/tables/ActivityLog'));

const UserActivity = () => {
  return (
    <Paper sx={{ width: '100%' }}>
      <ActivityLog eventType="appointment" userType="user" />
    </Paper>
  )
}

export default UserActivity