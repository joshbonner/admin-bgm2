import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Grid } from "@mui/material";
import { StyledButtonSuccess } from "../../components/styled-elements/buttonStyles";

const Textarea = styled.textarea`
  width: 100%;
  height: 80px;
  -moz-border-bottom-colors: none;
  -moz-border-left-colors: none;
  -moz-border-right-colors: none;
  -moz-border-top-colors: none;
  background: none repeat scroll 0 0 rgba(0, 0, 0, 0.07);
  border-color: -moz-use-text-color #ffffff #ffffff -moz-use-text-color;
  border-image: none;
  border-radius: 6px 6px 6px 6px;
  border-style: none solid solid none;
  border-width: medium 1px 1px medium;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12) inset;
  color: #ffffff;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 1em;
  line-height: 1.4em;
  padding: 5px 8px;
  transition: background-color 0.2s ease 0s;

  &:focus {
    background: none repeat scroll 0 0 #333333;
    outline-width: 0;
  }
`;

export default function TokenForm({
  api,
  handleInputChange,
  apiSave,
  buttonDisabled,
}) {
  return (
    <Grid container item flexDirection={"row"} columnSpacing={2} key={api._id}>
      <Grid container item md={11} sx={12}>
        <p style={{ marginBottom: "5px" }}>{api.name}</p>
        <Textarea
          value={api.value}
          name={api._id}
          label={api.name}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid container item md={1} sx={12}>
        <StyledButtonSuccess
          style={{ width: "100%" }}
          onClick={() => apiSave(api._id, api.value)}
          disabled={buttonDisabled}
        >
          Change
        </StyledButtonSuccess>
      </Grid>
    </Grid>
  );
}

TokenForm.propTypes = {
  api: PropTypes.object,
  handleInputChange: PropTypes.func,
  apiSave: PropTypes.func,
  buttonDisabled: PropTypes.bool,
};
