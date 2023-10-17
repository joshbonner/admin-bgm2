import PropTypes from "prop-types";
import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isEmpty from "is-empty";
import { Grid } from "@mui/material";
import { StyledButtonPrimary } from "../../components/styled-elements/buttonStyles";
import StyledSelect from "../../components/styled-elements/StyledSelect";
import StyledDatePicker from "../../components/styled-elements/StyledDatePicker";
import { getData as getAccounts } from "../../api/accounts";
import { makeExcelAndDownload } from "../../config/export-excel";
import StyledDateRangePicker from "../../components/styled-elements/StyledDateRangePicker";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function DashForm(props) {
  const initialErrors = {
    start: "",
    end: "",
    plug: "",
    ad: "",
    timezone: "",
  };
  const [date, setDate] = React.useState({
    start: dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD"),
    end: dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD"),
  });
  const [timezone, setTimezone] = React.useState(undefined);
  const [account, setAccount] = React.useState({
    plugAccount: {},
    adAccount: {},
  });
  const [unavailable, setUnavailable] = React.useState(true);
  const [loadUsedAccount, setLoadUsedAccount] = React.useState({
    plug: "",
    ad: "",
  });
  const [accounts, setAccounts] = React.useState([]);
  const [revenueLoading, setRevenueLoading] = React.useState(false);
  const [spendLoading, setSpendLoading] = React.useState(false);
  const [errors, setErrors] = React.useState(initialErrors);

  React.useEffect(() => {
    getInitAccounts();
  }, []);

  React.useEffect(() => {
    if (
      loadUsedAccount.plug === account.plugAccount.id &&
      loadUsedAccount.ad === account.adAccount.id &&
      props.revenues.length !== 0
    )
      setUnavailable(false);
    else setUnavailable(true);
  }, [account]);

  const getInitAccounts = async () => {
    const result = await getAccounts();
    setAccounts(result);
  };
  console.log(date);
  const handleSearchDate = (e) => setDate({ ...date, [e.name]: e.value });
  const handleAccountSelect = (accountType, accountContent) =>
    setAccount({ ...account, [accountType]: accountContent });
  const handleTimezoneSelect = (name, tz) => setTimezone(tz.id);

  const validateForm = () => {
    var isValid = true;
    if (isEmpty(date.start)) {
      setErrors({ ...errors, start: "Start date field is required" });
      isValid = false;
    }
    if (isEmpty(date.end)) {
      setErrors({ ...errors, end: "End date field is required" });
      isValid = false;
    }
    if (isEmpty(timezone)) {
      setErrors({ ...errors, timezone: "Timezone is required" });
      isValid = false;
    }
    if (isEmpty(account.adAccount)) {
      setErrors({ ...errors, ad: "Ad Account is required" });
      isValid = false;
    }
    if (isEmpty(account.plugAccount)) {
      setErrors({ ...errors, plug: "Plug Account is required" });
      isValid = false;
    }
    return isValid;
  };

  const getData = async () => {
    setUnavailable(true);
    setErrors(initialErrors);
    if (!validateForm()) return;
    var plugAccount = [account.plugAccount.id];
    if (plugAccount[0] === "all") {
      plugAccount = [
        "tapp",
        "infuse",
        "affiliate",
        // "aragon",
        // "panelxyz",
        ...accounts
          .filter((item) => item.accountType === "plug")
          .map((item) => item.token),
      ];
    }
    await props.getData(
      date.start,
      date.end,
      plugAccount,
      account.adAccount,
      timezone,
    );
    setLoadUsedAccount({
      plug: account.plugAccount.id,
      ad: account.adAccount.map((item) => item.id),
    });
    if (props.revenues.length !== 0) setUnavailable(false);
  };

  const refreshRevenues = async () => {
    setRevenueLoading(true);
    var plugAccount = [account.plugAccount.id];
    if (plugAccount[0] === "all") {
      plugAccount = [
        "tapp",
        "infuse",
        "affiliate",
        "aragon",
        "panelxyz",
        ...accounts
          .filter((item) => item.accountType === "plug")
          .map((item) => item.token),
      ];
    }
    await props.refreshRevenues(date.start, date.end, plugAccount, timezone);
    setRevenueLoading(false);
  };

  const refreshSpends = async () => {
    setSpendLoading(true);
    var adAccount = account.adAccount.map((item) => item);
    await props.refreshSpends(date.start, date.end, adAccount, timezone);
    setSpendLoading(false);
  };

  const exportExcel = () => {
    makeExcelAndDownload(props.revenues);
  };

  return (
    <Grid container item spacing={2}>
      {/*
      <Grid container item spacing={2}>
        <Grid container item lg={12} xs={6}>
          <StyledDatePicker
            label="Start Date"
            name="start"
            value={date.start}
            onchange={handleSearchDate}
            maxDate={dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD")}
            className="form-item-animation"
            sx={{
              opacity: 0,
              animationDelay: "0.0s",
            }}
            error={errors.start}
          />
        </Grid>
        <Grid container item lg={12} xs={6}>
          <StyledDatePicker
            label="End Date"
            name="end"
            value={date.end}
            onchange={handleSearchDate}
            maxDate={dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD")}
            minDate={date.start}
            className="form-item-animation"
            sx={{
              opacity: 0,
              animationDelay: "0.05s",
            }}
            error={errors.end}
          />
        </Grid>
      </Grid>
          */}
      <Grid container item spacing={2}>
        <Grid container item lg={12} sm={4} xs={12}>
          <StyledDateRangePicker
            onChange={(val) => {
              console.log(val);
              setDate({
                start: val.startDate,
                end: val.endDate,
              });
            }}
          />
        </Grid>
      </Grid>
      <Grid container item spacing={2}>
        <Grid container item lg={12} sm={4} xs={12}>
          <StyledSelect
            name="plugAccount"
            label="Plug Account"
            onchange={handleAccountSelect}
            data={[
              { name: "All", value: "all" },
              ...accounts
                .filter((item) => item.accountType === "plug")
                .map((item) => ({ name: item.name, value: item.token })),
              { name: "BGM Affiliate", value: "affiliate" },
              { name: "Tapp", value: "tapp" },
              { name: "Infuse", value: "infuse" },
              { name: "Fluent", value: "fluent" },
              // { name: "Aragon", value: "aragon" },
              // { name: "Panel XYZ", value: "panelxyz" },
            ]}
            className="form-item-animation"
            sx={{
              opacity: 0,
              animationDelay: "0.1s",
            }}
            error={errors.plug}
          />
        </Grid>
        <Grid container item lg={12} sm={4} xs={12}>
          <StyledSelect
            name="adAccount"
            label="Ad Account"
            multiple={true}
            onchange={handleAccountSelect}
            data={[
              { name: "All", value: "all", multiElement: "All" },
              ...accounts
                .filter(
                  (item) =>
                    item.accountType === "tiktok" ||
                    item.accountType === "snapchat" ||
                    item.accountType === "facebook",
                )
                .sort((a, b) => {
                  if (a.accountType < b.accountType) {
                    return -1;
                  }
                  if (a.accountType > b.accountType) {
                    return 1;
                  }
                  return 0;
                })
                .map((item) => ({
                  ...item,
                  multiElement: (
                    <React.Fragment>
                      {item.accountType === "tiktok" ? (
                        <img src="/assets/tik-tok.png" width={20} />
                      ) : item.accountType === "snapchat" ? (
                        <img src="/assets/snapchat.png" width={20} />
                      ) : item.accountType === "facebook" ? (
                        <img src="/assets/facebook.png" width={20} />
                      ) : (
                        <i>other</i>
                      )}{" "}
                      &nbsp; {item.name}
                    </React.Fragment>
                  ),
                  value: item.token,
                  accountType: item.accountType,
                })),
            ]}
            style={{ display: "flex" }}
            className="form-item-animation"
            sx={{
              opacity: 0,
              animationDelay: "0.15s",
            }}
            error={errors.ad}
          />
        </Grid>
        <Grid container item lg={12} sm={4} xs={12}>
          <StyledSelect
            name="selectTimezone"
            label="Timezone"
            onchange={handleTimezoneSelect}
            data={[
              { name: "New York", value: "New_York" },
              { name: "Chicago", value: "Chicago" },
            ]}
            className="form-item-animation"
            sx={{
              opacity: 0,
              animationDelay: "0.2s",
            }}
            error={errors.timezone}
          />
        </Grid>
      </Grid>
      <Grid container item>
        <StyledButtonPrimary
          style={{ width: "100%" }}
          // variant="outlined"
          onClick={getData}
        >
          <span>Get Connections</span>
        </StyledButtonPrimary>
      </Grid>
      <Grid container item direction={"row"} spacing={1}>
        <Grid container item xs={6}>
          <StyledButtonPrimary
            disabled={unavailable}
            onClick={refreshRevenues}
            fullWidth
          >
            {revenueLoading ? (
              <img
                src={"/assets/loading/loading-bolt.gif"}
                width={30}
                height={30}
              />
            ) : (
              <span>Revenues</span>
            )}
          </StyledButtonPrimary>
        </Grid>
        <Grid container item xs={6}>
          <StyledButtonPrimary
            disabled={unavailable}
            onClick={refreshSpends}
            fullWidth
          >
            {spendLoading ? (
              <img
                src={"/assets/loading/loading-bolt.gif"}
                width={30}
                height={30}
              />
            ) : (
              <span>Spends</span>
            )}
          </StyledButtonPrimary>
        </Grid>
        <Grid container item xs={12}>
          <StyledButtonPrimary
            disabled={unavailable}
            onClick={exportExcel}
            fullWidth
          >
            {spendLoading ? (
              <img
                src={"/assets/loading/loading-bolt.gif"}
                width={30}
                height={30}
              />
            ) : (
              <span style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/assets/xlsx.png"
                  width={25}
                  height={25}
                  style={{ marginRight: "10px" }}
                />{" "}
                Download
              </span>
            )}
          </StyledButtonPrimary>
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
