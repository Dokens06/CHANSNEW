import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material'
import { PrimaryThemeColor, PrimaryColor } from '../../utils/constant'

const ConfirmationPopup = ({ message, open, onConfirm, onCancel}) => {
  return (
        <Dialog
            open={open}
            onClose={onCancel}
            fullWidth
            maxWidth="sm"
        >  
            <DialogTitle>Confirmation Message</DialogTitle>
            <DialogContent >
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }}onClick={onCancel}>Cancel</Button>
                <Button variant="contained" sx={{ ...PrimaryThemeColor }} onClick={onConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
  )
}

export default ConfirmationPopup