import React from "react";
import { IconButton, TextField, Typography } from "@mui/material";
// import { IMaskInput } from "react-imask";
import InputMask from "react-input-mask";
import EventIcon from "@mui/icons-material/Event";
import { DateRangePicker } from "mui-daterange-picker";
import Popover from "@mui/material/Popover";
import { formatDate } from "../../utils/dateformat";
import dayjs from "dayjs";

export default function StyledDateRangePicker({ value, onChange }) {
  const [dateRange, setDateRange] = React.useState({
    startDate: "",
    endDate: "",
  });
  const [anchorEl, setAnchorEl] = React.useState(null);

  const dateRangePickerToggle = (event) => setAnchorEl(event.currentTarget);
  const handleDateRangePickerClose = () => setAnchorEl(null);
  const datePickerOpen = Boolean(anchorEl);
  const id = datePickerOpen ? "simple-popover" : undefined;

  const handleDateRangeChange = (dr) => {
    setDateRange({
      startDate: formatDate(dr.startDate),
      endDate: formatDate(dr.endDate),
    });

    onChange({
      startDate: dayjs.tz(formatDate(dr.startDate), "EST").format("YYYY-MM-DD"),
      endDate: dayjs.tz(formatDate(dr.endDate), "EST").format("YYYY-MM-DD"),
    });
  };

  const handleInputDateRange = (e) => {
    const d = e.target.value;
    const startDate = d.split(" - ")[0];
    const endDate = d.split(" - ")[1];
    setDateRange({
      startDate: startDate,
      endDate: endDate,
    });
    // const isValidDateRage = validateDateRangeFormat(e.target.value);
  };

  return (
    <div style={{ width: "100%" }}>
      <InputMask
        mask="99/99/9999 - 99/99/9999"
        value={`${dateRange.startDate} - ${dateRange.endDate}`}
        onChange={handleInputDateRange}
      >
        {(inputProps) => (
          <TextField
            {...inputProps}
            variant="outlined"
            fullWidth
            size="small"
            label="Enter your Date Range"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={dateRangePickerToggle}
                  aria-describedby={id}
                  sx={{ marginRight: "0" }}
                >
                  <EventIcon />
                </IconButton>
              ),
            }}
          />
        )}
      </InputMask>
      <Popover
        id={id}
        onClose={handleDateRangePickerClose}
        anchorEl={anchorEl}
        open={datePickerOpen}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <DateRangePicker
            open={true}
            toggle={() => {}}
            onChange={(range) => {
              handleDateRangeChange(range);
              handleDateRangePickerClose();
            }}
          />
        </Typography>
      </Popover>
    </div>
  );
}
