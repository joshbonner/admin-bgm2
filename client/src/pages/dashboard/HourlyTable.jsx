import React, { Fragment, useState } from "react";
import { Grid, Collapse } from "@mui/material";
import { StyledButtonPrimary } from "../../components/styled-elements/buttonStyles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import StyledTable from "../../components/styled-elements/table/StyledTable";
import PropTypes from "prop-types";
import style from "styled-components";

const P = style.p`
  margin: 0;
`;

const columns = [
  {
    id: "hour",
    align: "center",
    label: "Hour",
    style: {
      width: "10px",
    },
    render: (hour) => <Fragment>{hour === 0 ? "12am" : hour <= 11 ? hour + "am" : hour === 12 ? hour + "pm" : (Number(hour) - 12).toString() + "pm" }</Fragment>
  },
  {
    id: "revenue",
    align: "center",
    label: "Revenue",
    render: (revenue) => <Fragment>{"$" + revenue.toFixed(2)}</Fragment>
  },
  {
    id: "spend",
    align: "center",
    label: "Spend",
    render: (spend) => <Fragment>{"$" + spend.toFixed(2)}</Fragment>
  },
  {
    id: "profit",
    align: "center",
    label: "Profit",
    render: (profit) => (
      <P
        style={
          profit > 0
            ? { color: "#2BC605" }
            : profit < 0
            ? { color: "#FF2020" }
            : { color: "#fff" }
        }
      >
        {`$${Number(profit).toFixed(2)}`}
      </P>
    ),
  },
  {
    id: "roas",
    align: "center",
    label: "ROAS",
    render: (roas) => (
      <P>
        {(Number(roas) * 100).toFixed() === "Infinity"
          ? "Infinity"
          : (Number(roas) * 100).toFixed() + " %"}
      </P>
    ),
  },
];

export default function HourlyTable({ roas, isLoading }) {
  const [expand, setExpand] = useState(false);
  return (
    <Grid container item xs={12}>
      <StyledButtonPrimary
        style={{ width: "100%", marginBottom: "5px" }}
        onClick={() => setExpand(!expand)}
      >
        {!expand ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </StyledButtonPrimary>
      <Collapse in={expand} sx={{ width: "100%" }}>
        <StyledTable columns={columns} data={roas} isLoading={isLoading} />
      </Collapse>
    </Grid>
  );
}

HourlyTable.propTypes = {
  roas: PropTypes.array,
  isLoading: PropTypes.bool
};
