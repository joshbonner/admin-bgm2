import React from "react";
import PropTypes from "prop-types";
import DataTable from "./DataTable";
import { StyledCard } from "../../components/styled-elements/styledCard";
import { getOnlySpends } from "../../api/dashboard";
import { getDataByConnection, getOnlyRevenues } from "../../api/dashboard";
import { Grid, Typography, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashForm from "./DashForm";
import addNotification from "react-push-notification";
import ChartBoard from "./ChartBoard";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getHourlyData } from "../../api/hourlyBreakdown";
import isEmpty from "is-empty";

dayjs.extend(utc);
dayjs.extend(timezone);
const todayDate = dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD");

export default function Dashboard() {
  const [loading, setLoading] = React.useState(false);
  const [revenues, setRevenues] = React.useState([]);
  const [hourlyRoas, setHourlyRoas] = React.useState([]);

  const [searchedVal, setSearchedVal] = React.useState({
    startDate: todayDate,
    plugAccount: [],
    adAccount: [],
    defaultTimezone: "New York",
  });

  const getData = async (
    startDate,
    endDate,
    plugAccount,
    adAccount,
    default_timezone,
  ) => {
    setLoading(true);
    setRevenues([]);
    setSearchedVal({
      plugAccount,
      adAccount,
      startDate,
      defaultTimezone: default_timezone,
    });
    var result = await getDataByConnection(
      startDate,
      endDate,
      plugAccount,
      adAccount,
      default_timezone,
    );
    var hourlyResult = await getHourlyData(
      startDate,
      endDate,
      result,
      adAccount,
    );
    if (!isEmpty(hourlyResult)) {
      setHourlyRoas(hourlyResult);
    }
    if (result === "server_error") return;
    setRevenues(result);
    setLoading(false);
    addNotification({
      title: "200: Success",
      subtitle: "Revenues are loaded successfully!",
      message: `Total: ${result.length}`,
      theme: "darkblue",
      duration: 5000,
      native: false,
      closeButton: "X",
    });
  };

  const refreshRevenues = async (
    startDate,
    endDate,
    plugAccount,
    default_timezone,
  ) => {
    const result = await getOnlyRevenues(
      startDate,
      endDate,
      plugAccount,
      default_timezone,
    );
    var newRevenues = revenues;
    newRevenues = newRevenues.map((item) => {
      const matched = result.filter((i) => i.name === item.name)[0];
      return {
        ...item,
        revenue: Number(matched.revenue),
        profit: Number(matched.revenue) - Number(item.spend),
        roas: Number(matched.revenue) / Number(item.spend),
      };
    });
    setRevenues(newRevenues);
  };

  const refreshSpends = async (startDate, endDate, adAccount) => {
    const result = await getOnlySpends(startDate, endDate, adAccount);
    var newRevenues = revenues;
    newRevenues = newRevenues.map((item) => {
      const matched = result.filter((i) => i.campaignId === item.campaignId)[0];
      return {
        ...item,
        spend: Number(matched.spend),
        profit: Number(item.revenue) - Number(matched.spend),
        roas: Number(item.revenue) / Number(matched.spend),
      };
    });
    setRevenues([...newRevenues]);
  };

  const handleConnectionDelete = (items) => {
    setRevenues(items);
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
              <DashForm
                getData={getData}
                refreshRevenues={refreshRevenues}
                refreshSpends={refreshSpends}
                revenues={revenues}
              />
            </Grid>
          </StyledCard>
        </Grid>
        <Grid container item spacing={1} lg={9} md={12}>
          <StyledCard>
            <Grid container item spacing={3}>
              <Grid container item>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "30px",
                    marginBottom: "30px",
                  }}
                >
                  <HomeIcon sx={{ fontSize: "33px" }} />
                  <Typography style={{ padding: "0 15px", fontSize: "20px" }}>
                    Dashboard
                  </Typography>
                </Box>
                <DataTable
                  revenues={revenues}
                  isLoading={loading}
                  setRevenues={setRevenues}
                  ondelete={handleConnectionDelete}
                  hourlyRoas={hourlyRoas}
                />
              </Grid>

              {/** Chart Data Component */}
              <Grid container item xs={12}>
                <ChartBoard searchedVal={searchedVal} tableLoading={loading} />
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>
      </Grid>
    </Grid>
  );
}

DashForm.propTypes = {
  revenues: PropTypes.array,
  getData: PropTypes.func,
  refreshRevenues: PropTypes.func,
  refreshSpends: PropTypes.func,
};
