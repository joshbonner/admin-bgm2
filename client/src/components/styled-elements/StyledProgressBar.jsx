import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Grid } from "@mui/material";
import PropTypes from "prop-types";

export default function StyledProgressLoading(props) {
  return (
    <Grid
      item
      sx={{
        zIndex: "99999",
        background: "rgba(0, 0, 0, 0.7)",
        display: props.isloading ? "flex" : "none",
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <CircularProgress
          variant="determinate"
          size={50}
          value={props.value}
          color="success"
        />
      </Box>
    </Grid>
  );
}

StyledProgressLoading.propTypes = {
  isloading: PropTypes.bool,
  value: PropTypes.number,
};
