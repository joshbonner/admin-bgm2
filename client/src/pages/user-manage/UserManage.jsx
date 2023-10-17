import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { StyledCard } from "../../components/styled-elements/styledCard";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import UserForm from "./UserForm";
import { deleteData, getData, resetPassword, editData } from "../../api/users";
import UserTable from "./UserTable";
import addNotification from "react-push-notification";

export default function UserManage() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async () => {
    setLoading(true);
    const result = await getData();
    setData(result);
    setLoading(false);
  };

  const handleItemDelete = async (_id) => {
    const deleted = await deleteData(_id);
    const updateData = data;
    updateData.splice(
      updateData.map((item) => item._id).indexOf(deleted._id),
      1,
    );
    setData([...updateData]);
  };

  const handlePasswordReset = async (_id) => {
    const changed = await resetPassword(_id);
    addNotification({
      title: `200: Success!`,
      subtitle: `${changed.name}'s Password Reset!`,
      theme: "light",
      duration: 5000,
      native: false,
      closeButton: "X",
    });
  };

  const handleItemEditToggle = async (_id) => {
    const changeData = data.map((item) => {
      if (item._id === _id) {
        return { ...item, edit: true };
      }
      return { ...item, edit: false };
    });
    setData(changeData);
  };

  const handleItemEdit = async (_id) => {
    // editData()
  };

  const addItem = (item) => {
    setData([item, ...data]);
  };

  return (
    <Grid
      item
      container
      xs={11}
      justifyContent="center"
      margin={"50px auto"}
      spacing={2}
    >
      <Grid container item spacing={2} direction="row">
        <Grid container item spacing={1} lg={3} md={12} direction={"column"}>
          <StyledCard>
            <Grid
              container
              item
              spacing={2}
              marginTop={10}
              sx={{ md: { margin: 0 } }}
            >
              <UserForm addNew={addItem} />
            </Grid>
          </StyledCard>
        </Grid>
        <Grid container item spacing={1} lg={9} md={12}>
          <StyledCard>
            <Box
              sx={{ display: "flex", marginTop: "30px", flexDirection: "row" }}
            >
              <ManageAccountsOutlinedIcon sx={{ fontSize: "33px" }} />
              <Typography style={{ padding: "0 15px", fontSize: "20px" }}>
                User Manage
              </Typography>
            </Box>
            <br />
            <UserTable
              data={data}
              handleItemDelete={handleItemDelete}
              handlePasswordReset={handlePasswordReset}
              handleItemEdit={handleItemEdit}
              handleItemEditToggle={handleItemEditToggle}
              loading={loading}
            />
          </StyledCard>
        </Grid>
      </Grid>
    </Grid>
  );
}
