import { Box, Button, Tooltip } from '@mui/material'
import { PrimaryColor, PrimaryThemeColor } from '../utils/constant'
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';

const ActionButtons = ({ id, addText, editText, onAdd, onEdit, iconOnly, customAddIcon }) => {
  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Tooltip title={editText} arrow disableInteractive>
          <Button color="primary" variant="outlined" sx={{ textTransform: 'none', borderColor: PrimaryColor, color: PrimaryColor }} size="small" onClick={() => onEdit(id)}>{iconOnly ? <EditIcon /> : editText}</Button>
        </Tooltip>
        <Tooltip title={addText} arrow disableInteractive>
          <Button color="success" variant="contained" sx={{ textTransform: 'none', ...PrimaryThemeColor }} size="small" onClick={() => onAdd(id)}>{iconOnly ? (customAddIcon ? customAddIcon : <GroupIcon />) : addText}</Button>
        </Tooltip>
      </Box>
    </>
  )
}

export default ActionButtons