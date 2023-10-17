import React, { useEffect, useState } from "react";
import { StyledCard } from "../../components/styled-elements/styledCard";
import { Grid, Box, Typography, Alert } from "@mui/material";
import WebhookIcon from "@mui/icons-material/Webhook";
import { editSocialApiById, getSocialApis } from "../../api/socials";
import addNotification from "react-push-notification";
import TokenForm from "./TokenForm";

export default function SocialDashboard() {
  const [socials, setSocials] = useState(null);
  const [inputs, setInputs] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const result = await getSocialApis();
    setSocials(result);
    setInputs(result);
  };

  const handleInputChange = (e) => {
    const result = inputs;
    const newInputs = result.map((item) => {
      if (item._id === e.target.name) {
        item.value = e.target.value;
      }
      return item;
    });
    console.log(newInputs);
    console.log(socials);
    setInputs(newInputs);
  };

  const apiSave = async (_id, value) => {
    const result = await editSocialApiById(_id, value);
    addNotification({
      title: `${result.name} has been Changed`,
      message: `Changed Value: ${result.value}`,
      theme: "light",
      duration: 5000,
      native: false,
      closeButton: "X",
    });
  };

  return (
    <Grid container item xs={11} rowSpacing={2} style={{ margin: "30px auto" }}>
      <StyledCard>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <WebhookIcon sx={{ fontSize: "33px" }} />
          <Typography style={{ padding: "0 15px", fontSize: "20px" }}>
            Data Key
          </Typography>
        </Box>

        <Grid container item style={{ margin: "30px auto" }}>
          <Alert severity="info">
            The character in {"${ }"} is the variable so don't change the value
          </Alert>
        </Grid>
        <Grid container item rowSpacing={2}>
          {inputs &&
            inputs.map((api) => (
              <TokenForm
                key={api._id}
                api={api}
                handleInputChange={handleInputChange}
                apiSave={apiSave}
                buttonDisabled={
                  !socials.filter((item) => item._id === api._id)[0].value ===
                  api.value
                }
              />
            ))}
        </Grid>
      </StyledCard>
    </Grid>
  );
}
