import PropTypes from "prop-types";
import React, { useEffect } from "react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Checkbox,
  ListItemText,
} from "@mui/material";
import isEmpty from "is-empty";

export default function StyledSelect(props) {
  const [state, setState] = React.useState([]);
  const [menuOpen, setMenuOpen] = React.useState(false);

  useEffect(() => {
    if (props.multiple) {
      props.onchange(
        props.name,
        props.data
          .filter((item) => state.indexOf(item.value) > -1)
          .map((item) => ({ ...item, name: item.name, id: item.value })),
      );
    }
  }, [state]);

  const handleChange = (event) => {
    if (!props.multiple) {
      setState([event.target.value]);
      props.onchange(props.name, {
        ...props.data.filter((item) => item.value === event.target.value)[0],
        name: props.data.filter((item) => item.value === event.target.value)[0]
          .name,
        id: event.target.value,
      });
    }
  };

  const handleCheckboxClick = (val) => {
    if (state.indexOf(val) > -1) {
      if (val === "all") {
        setState([]);
      } else {
        const items = [...state];
        items.splice(items.indexOf(val), 1);
        setState(items);
      }
    } else {
      if (val === "all") {
        setState(props.data.map((item) => item.value));
      } else {
        setState([...state, val]);
      }
    }
  };

  const handleItemClick = (val) => {
    if (state.indexOf(val) > -1) {
      const items = [...state];
      items.splice(items.indexOf(val), 1);
      setState(items);
    } else {
      setState([...state, val]);
    }
    setMenuOpen(false);
  };

  return (
    <FormControl
      fullWidth
      error={props.error !== "" && typeof props.error == "string"}
      className={props.className}
      sx={props.sx}
      style={props.style}
    >
      <InputLabel size="small">{props.label}</InputLabel>
      <Select
        open={menuOpen}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        label={props.label}
        onChange={handleChange}
        value={props.multiple ? state : state[0] === undefined ? "" : state[0]}
        renderValue={(selected) =>
          props.multiple
            ? selected
                .map(
                  (item) => props.data.filter((i) => i.value === item)[0].name,
                )
                .join(",")
            : props.data.filter((item) => item.value === selected)[0].name
        }
        size="small"
        multiple={props.multiple}
        error={props.error !== "" && typeof props.error == "string"}
        sx={{
          "& .MuiSelect-select.MuiSelect-outlined": {
            maxWidth: "75%",
          },
        }}
      >
        {props.data.map((item) =>
          props.multiple ? (
            <MenuItem key={item.value} value={item.value}>
              <Checkbox
                checked={state.indexOf(item.value) !== -1}
                sx={{
                  "&.Mui-checked": {
                    color: "#cacccf",
                  },
                }}
                onClick={() => handleCheckboxClick(item.value)}
              />
              <ListItemText
                primary={item.multiElement}
                onClick={() => handleItemClick(item.value)}
              />
            </MenuItem>
          ) : (
            <MenuItem key={item.value} value={item.value}>
              {item.name}
            </MenuItem>
          ),
        )}
      </Select>
      <FormHelperText>
        {!isEmpty(props.error) ? props.error : ""}
      </FormHelperText>
    </FormControl>
  );
}

StyledSelect.defaultProps = {
  error: "",
  multiple: false,
};

StyledSelect.propTypes = {
  data: PropTypes.array.isRequired,
  name: PropTypes.string,
  label: PropTypes.string,
  onchange: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.object,
  style: PropTypes.object,
  multiple: PropTypes.bool,
};
