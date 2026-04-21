import React from 'react'
import { Box, Button } from '@mui/material'
import ServicesPopup from '../../components/popup/ServicesPopup'
import { PrimaryThemeColor } from '../../utils/constant';

const ActionButtons = ({ id, setLoadList }) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setLoadList(true);
    };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button color="success" variant="contained" sx={{ textTransform: 'none', ...PrimaryThemeColor }} size="small" onClick={() => handleOpen(id)}>Add Services</Button>
      </Box>
    </>
  )
}

export default ActionButtons