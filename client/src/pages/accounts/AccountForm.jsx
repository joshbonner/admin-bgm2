import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import React from "react";
import { addData } from "../../api/accounts";
import { StyledButtonSuccess } from "../../components/styled-elements/buttonStyles";
import StyledSelect from "../../components/styled-elements/StyledSelect";
import StyledTextField from "../../components/styled-elements/StyledTextField";
// import StyledAutoCompelete from "../../components/styled-elements/StyledAutoCompelete"

const accountTypes = [
  { name: "Plug Account", value: "plug" },
  { name: "Tiktok Account", value: "tiktok" },
  { name: "Snapchat Account", value: "snapchat" },
  { name: "Facebook Account", value: "facebook" },
];

export default function AccountForm(props) {
  const initialAccount = {
    accountType: "",
    name: "",
    token: "",
    accessToken: "",
  };
  const initialErrors = {
    accountType: "",
    name: "",
    token: "",
    accessToken: "",
  };
  const [account, setAccount] = React.useState(initialAccount);
  const [errors, setErrors] = React.useState(initialErrors);
  const [atInputVisible, setAtInputVisible] = React.useState(false);

  const handleAccountTypeChange = (name, item) => {
    item.id === "tiktok" ? setAtInputVisible(true) : setAtInputVisible(false);
    setAccount({ ...account, accountType: item.id });
  };

  const handleAccessTokenChange = (name, item) => {
    setAccount({ ...account, accessToken: item.id });
  };

  const handleTextFieldChange = (e) =>
    setAccount({ ...account, [e.target.name]: e.target.value });

  const handleAccountSave = async () => {
    // Validate Fields
    const newItem = await addData(account);
    if (!newItem.isValid) {
      return setErrors(newItem.errors);
    }
    setAccount({
      ...account,
      name: "",
      token: "",
    });
    props.addNew(newItem.data);
  };

  return (
    <Grid container item xs={12} spacing={1} flexDirection={"row"}>
      <Grid container item lg={2} md={6} xs={6}>
        <StyledSelect
          data={accountTypes}
          name="accounttype"
          label={"Account Type"}
          onchange={handleAccountTypeChange}
          value={account.accountType}
          error={errors.accountType}
        />
      </Grid>
      <Grid container item lg={2} md={6} xs={6}>
        <StyledTextField
          label="Name"
          name="name"
          onchange={handleTextFieldChange}
          value={account.name}
          error={errors.name}
        />
      </Grid>
      <Grid container item lg={atInputVisible ? 3 : 6} md={12} xs={12}>
        <StyledTextField
          label="Token"
          name="token"
          onchange={handleTextFieldChange}
          value={account.token}
          error={errors.token}
        />
      </Grid>
      <Grid
        container
        item
        lg={3}
        md={12}
        xs={12}
        sx={{ display: `${atInputVisible ? "block" : "none"}` }}
      >
        <StyledSelect
          label="Access Token"
          name="accessToken"
          onchange={handleAccessTokenChange}
          value={account.accessToken}
          error={errors.accessToken}
          data={props.adsAccounts}
        />
      </Grid>
      <Grid container item lg={2} md={12}>
        <StyledButtonSuccess
          color="success"
          fullWidth
          onClick={handleAccountSave}
        >
          Add Account
        </StyledButtonSuccess>
      </Grid>
    </Grid>
  );
}

AccountForm.propTypes = {
  addNew: PropTypes.func,
  handleChange: PropTypes.func,
  adsAccounts: PropTypes.array,
};
