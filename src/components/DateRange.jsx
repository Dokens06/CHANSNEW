import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PrimaryColor, PrimaryThemeColor } from '../utils/constant';
import { useAlert } from '../hooks/useAlert';

function DateRangePicker({ onSearch }) {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const showAlert = useAlert();

  const handleSearch = () => {
    if ((fromDate && toDate) || (!fromDate && !toDate)) {
        onSearch(fromDate, toDate);
    } else {
        showAlert('Please select a date range', 'error');
    }
  };

  const handleReset = () => {
    onSearch('', '');
    setFromDate(null);
    setToDate(null);
  }

  return (
    <Box className="flex gap-4 items-center">
        <Button variant="contained" sx={{ textTransform: 'none', ...PrimaryThemeColor }} onClick={handleSearch}>Filter</Button>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box className="flex gap-4 items-center">
                <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
                />

                <DatePicker
                label="To"
                value={toDate}
                minDate={fromDate} // Prevent selecting a date before "from"
                onChange={(newValue) => setToDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
                />
            </Box>
        </LocalizationProvider>
        <Button variant="outlined" sx={{ textTransform: 'none', borderColor: PrimaryColor, color: PrimaryColor }} onClick={handleReset}>Reset</Button>
    </Box>
  );
}

export default DateRangePicker;