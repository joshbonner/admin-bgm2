import PropTypes from "prop-types";
import React from "react";
import StyledTable from "../../components/styled-elements/table/StyledTable";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import Tooltip from "@mui/material/Tooltip";
import ModeIcon from "@mui/icons-material/Mode";
import DoneIcon from "@mui/icons-material/Done";

export default function UserTable(props) {
  const columns = [
    {
      id: "no",
      label: "no",
      style: {
        width: "5%",
      },
    },
    {
      id: "name",
      label: "Name",
      editable: true,
      style: {
        width: "10%",
      },
    },
    {
      id: "email",
      label: "Email",
      editable: true,
      style: {
        width: "10%",
      },
    },
    {
      id: "edit",
      align: "center",
      label: "",
      style: {
        padding: "0",
        width: "5%",
      },
      render: (item, col) => (
        <React.Fragment>
          <Tooltip title="Edit">
            {col.edit ? (
              <IconButton onClick={() => props.handleItemEdit(col.key)}>
                <DoneIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => props.handleItemEditToggle(col.key)}>
                <ModeIcon />
              </IconButton>
            )}
          </Tooltip>
          <Tooltip title="Reset Password: 123456789">
            <IconButton onClick={() => props.handlePasswordReset(col.key)}>
              <LockResetIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              onClick={() => props.handleItemDelete(col.key)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </React.Fragment>
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

UserTable.propTypes = {
  data: PropTypes.array,
  handleItemDelete: PropTypes.func,
  loading: PropTypes.bool,
};
