import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DateRangePicker({ onSearch }) {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <Box className="flex gap-4 items-center w-full">
      <DatePicker
        sx={{
          width: "100%"
        }}
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);

          // ✅ Auto call search when both dates are selected
          const [start, end] = update;
          if (start && end) {
            onSearch(start, end);
          }

          // ✅ If cleared, reset search
          if (!start && !end) {
            onSearch("", "");
          }
        }}
        isClearable // ✅ shows reset "X" inside input
        placeholderText="Select date range"
        customInput={<TextField label="Date Range"
                    autoComplete="off"
                    sx={{
                        marginY: 0,
                        width: "100%"
                    }}/>}
      />
    </Box>
  );
}

export default DateRangePicker;