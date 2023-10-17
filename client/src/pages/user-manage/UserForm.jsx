import { Grid } from "@mui/material";
import React from "react";
import { addData } from "../../api/snapchat";
import { StyledButtonSuccess } from "../../components/styled-elements/buttonStyles";
import StyledTextField from "../../components/styled-elements/StyledTextField";

export default function UserForm(props) {
  const initialUser = {
    name: "",
    email: "",
    password: "",
    password2: "",
    avatar: "",
  };

  const [user, setUser] = React.useState(initialUser);

  const [errors, setErrors] = React.useState(initialUser);

  const handleTextFieldChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async () => {
    // Validate Fields
    const newUser = await addData(user);
    if (!newUser.isValid) {
      return setErrors(newUser.errors);
    }
    setErrors(initialUser);
    props.addNew(newUser.data);
  };

  return (
    <Grid container item xs={12} spacing={3} flexDirection={"row"}>
      <Grid container item xs={12}>
        <StyledTextField
          label="Name"
          name="name"
          onchange={handleTextFieldChange}
          value={user.name}
          error={errors.name}
        />
      </Grid>
      <Grid container item xs={12}>
        <StyledTextField
          label="Email"
          name="email"
          type={"email"}
          onchange={handleTextFieldChange}
          value={user.email}
          error={errors.email}
        />
      </Grid>
      <Grid container item xs={12}>
        <StyledTextField
          label="Password"
          name="password"
          type={"password"}
          onchange={handleTextFieldChange}
          value={user.password}
          error={errors.password}
        />
      </Grid>
      <Grid container item xs={12}>
        <StyledTextField
          label="Password Confirm"
          name="password2"
          type={"password"}
          onchange={handleTextFieldChange}
          value={user.password2}
          error={errors.password2}
        />
      </Grid>
      <Grid container item xs={12}>
        <StyledButtonSuccess color="success" fullWidth onClick={handleSave}>
          Add User
        </StyledButtonSuccess>
      </Grid>
    </Grid>
  );
}
