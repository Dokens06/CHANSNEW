import React, { lazy } from 'react'
import { Box, Button } from '@mui/material'
import { PrimaryColor, PrimaryThemeColor } from '../../utils/constant'
const DoctorsPopup = lazy(() => import('../../components/popup/DoctorsPopup'))
const EditServicePopup = lazy(() => import('../../components/popup/EditServicePopup'))

const ActionButtons = ({ id, onAddDoctor, onEditService }) => {

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button color="primary" variant="outlined" sx={{ textTransform: 'none', borderColor: PrimaryColor, color: PrimaryColor }} size="small" onClick={() => onEditService(id)}>Edit Service</Button>
        <Button color="success" variant="contained" sx={{ textTransform: 'none', ...PrimaryThemeColor }} size="small" onClick={() => onAddDoctor(id)}>Add Doctors</Button>
      </Box>
    </>
  )
}

export default ActionButtons