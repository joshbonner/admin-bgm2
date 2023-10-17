import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import React from "react";
import isEmpty from "is-empty";

export default function StyledTextField(props) {
  return (
    <TextField
      name={props.name}
      label={props.label}
      onChange={props.onchange}
      value={props.value}
      variant="outlined"
      fullWidth
      type={props.type}
      size="small"
      error={props.error !== "" && typeof props.error == "string"}
      helperText={!isEmpty(props.error) ? props.error : ""}
    />
  );
}

StyledTextField.defaultProps = {
  type: "text",
};

StyledTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onchange: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.object,
  style: PropTypes.object,
  type: PropTypes.string,
};
