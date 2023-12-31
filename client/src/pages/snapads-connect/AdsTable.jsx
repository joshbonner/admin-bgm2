import PropTypes from "prop-types";
import React from "react";
import StyledTable from "../../components/styled-elements/table/StyledTable";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdsTable(props) {
  const columns = [
    {
      id: "no",
      label: "no",
      style: {
        width: "5%",
      },
    },
    {
      id: "accountType",
      label: "Account Type",
      style: {
        width: "10%",
      },
    },
    {
      id: "idType",
      label: "Id Type",
      style: {
        width: "10%",
      },
    },
    {
      id: "name",
      label: "Name",
      style: {
        width: "25%",
      },
    },
    {
      id: "token",
      label: "Token",
      align: "left",
      style: {
        width: "45%",
      },
    },
    {
      id: "delete",
      align: "center",
      label: "",
      style: {
        padding: "0",
        width: "5%",
      },
      render: (item, col) => (
        <IconButton
          sx={{ margin: "5px" }}
          onClick={() => props.handleItemDelete(col.key)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  var index = 1;
  return (
    <StyledTable
      data={props.data.map((item) => ({ ...item, no: index++, key: item._id }))}
      columns={columns}
      isLoading={props.loading}
      total={false}
      className="bounce-up"
    />
  );
}

AdsTable.propTypes = {
  data: PropTypes.array,
  handleItemDelete: PropTypes.func,
  loading: PropTypes.bool,
};
