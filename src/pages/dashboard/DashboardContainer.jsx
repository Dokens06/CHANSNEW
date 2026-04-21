import React from 'react'
import { Box, Grid, Typography, Button } from '@mui/material'
import { useEventCalendar } from '../../hooks/useEventCalendar';
import { getEventByCalendar } from '../../providers/list'
import EventCalendar from '../../components/EventCalendar'

const DashboardContainer = () => {
  const { loadList, appointments, fetchEventsForMonth} = useEventCalendar(getEventByCalendar, 'all');

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box className="gap-4" sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
              <Typography variant="h1" sx={{ fontSize: '28px' }}>Upcoming Events</Typography>
          </Box>
        </Grid>
        <Grid className="mx-auto" size={12}>
          <Box className="flex flex-col gap-4">
              <EventCalendar eventType="all" loadList={loadList} events={appointments} fetchEventsForMonth={fetchEventsForMonth}/>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardContainer