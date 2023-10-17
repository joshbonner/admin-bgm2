import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";
import { Grid } from "@mui/material";
import StyledProgressLoading from "../../components/styled-elements/StyledProgressBar";
import { getRoasData, insertRoasData } from "../../api/chart";
import StyledDatePicker from "../../components/styled-elements/StyledDatePicker";
import { StyledButtonPrimary } from "../../components/styled-elements/buttonStyles";
import CachedIcon from "@mui/icons-material/Cached";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getDataByConnection } from "../../api/dashboard";
import isEmpty from "is-empty";

dayjs.extend(utc);
dayjs.extend(timezone);
const todayDate = dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD");
const defaultChartDuration = 7;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: `ROAS Chart`,
    },
  },
  scales: {
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return value + "%";
        },
      },
    },
  },
};

export default function ChartBoard(props) {
  const { searchedVal, tableLoading } = props;
  const [state, setState] = useState({
    labels: [],
    datasets: [
      {
        fill: "start",
        label: `roas`,
        data: [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });
  const [startBoard, setStartBoard] = useState(true);
  const [chartDate, setChartDate] = React.useState({
    start: dayjs(todayDate)
      .add(1 - defaultChartDuration, "days")
      .format("YYYY-MM-DD"),
    end: todayDate,
  });
  const [chartDateError, setChartDateError] = React.useState({
    start: "",
    end: "",
  });
  const [chartLoading, setChartLoading] = React.useState({
    isLoading: false,
    progress: 0,
  });

  useEffect(() => {
    if (tableLoading) {
      setStartBoard(false);
      setChartDate({
        start: dayjs(searchedVal.startDate)
          .add(1 - defaultChartDuration, "days")
          .format("YYYY-MM-DD"),
        end: searchedVal.startDate,
      });
      chartLoad(
        dayjs(searchedVal.startDate)
          .add(1 - defaultChartDuration, "days")
          .format("YYYY-MM-DD"),
        searchedVal.startDate,
      );
    }
  }, [tableLoading]);

  const handleSearchDate = (e) =>
    setChartDate({ ...chartDate, [e.name]: e.value });

  const chartLoad = async (startDate, endDate) => {
    if (isEmpty(chartDate.start)) {
      setChartDateError({ ...chartDateError, start: "Start Date is required" });
      return;
    }
    if (isEmpty(chartDate.end)) {
      setChartDateError({ ...chartDateError, end: "End Date is required" });
      return;
    }

    if (searchedVal.adAccount[0].accountType === "snapchat") {
      return;
    }

    const start = isEmpty(startDate) ? chartDate.start : startDate;
    const end = isEmpty(endDate) ? chartDate.end : endDate;
    setChartLoading({
      isLoading: true,
      progress: 0,
    });
    var chartResult = [],
      dayres = [],
      roasData = [];
    if (
      searchedVal.plugAccount.length === 1 &&
      searchedVal.adAccount.length === 1
    ) {
      roasData = await getRoasData(
        start,
        end,
        searchedVal.plugAccount[0],
        searchedVal.adAccount[0].name,
      );
    }
    var dateDuration = 0;
    while (true) {
      dateDuration++;
      const currentDate = dayjs(start)
        .add(dateDuration - 1, "days")
        .format("YYYY-MM-DD");
      if (currentDate === end) break;
    }

    let i = 1;
    while (true) {
      const curDate = dayjs(start)
        .add(i - 1, "days")
        .format("YYYY-MM-DD");
      if (roasData.filter((item) => item.date === curDate).length === 0) {
        dayres = await getDataByConnection(
          curDate,
          curDate,
          searchedVal.plugAccount,
          searchedVal.adAccount,
          searchedVal.defaultTimezone,
        );
        var roasAvg = 0;
        var totalRevenue = 0,
          totalSpend = 0;
        dayres.forEach((item) => {
          totalRevenue += Number(item.revenue);
          totalSpend += Number(item.spend);
        });

        if (totalRevenue !== 0 && totalSpend !== 0)
          roasAvg = (totalRevenue / totalSpend) * 100;
        chartResult.push({
          roas: roasAvg,
          isStored:
            curDate === todayDate &&
            searchedVal.plugAccount.length !== 1 &&
            searchedVal.adAccount.length !== 1
              ? true
              : false,
          date: curDate,
        });
      } else {
        chartResult.push({
          roas: roasData.filter((item) => item.date === curDate)[0].roas,
          isStored: true,
          date: curDate,
        });
      }
      setChartLoading({
        isLoading: true,
        progress: (100 / dateDuration) * i,
      });
      i++;
      if (curDate === end) break;
    }

    if (chartResult.length !== 0) {
      await insertRoasData(
        searchedVal.plugAccount[0],
        searchedVal.adAccount[0].name,
        chartResult,
      );
    }
    setChartLoading({ ...chartLoading, isLoading: false });
    let dayInd = 0;
    var chartLabels = [];
    while (true) {
      const curDate = dayjs(start).add(dayInd, "days").format("YYYY-MM-DD");
      chartLabels.push(curDate);

      if (curDate === end) {
        break;
      }
      dayInd++;
    }
    setState({
      datasets: [
        { ...state.datasets[0], data: chartResult.map((item) => item.roas) },
      ],
      labels: chartLabels,
    });
  };

  return (
    <Grid container item rowSpacing={2}>
      <Grid container item xs={12} columnSpacing={2}>
        <Grid container item lg={3} xs={5}>
          <StyledDatePicker
            label="Start Date"
            name="start"
            value={chartDate.start}
            onchange={handleSearchDate}
            maxDate={chartDate.end}
            className="form-item-animation"
            sx={{
              opacity: 0,
              animationDelay: "0.0s",
            }}
            error={chartDateError.start}
          />
        </Grid>
        <Grid container item lg={3} xs={5}>
          <StyledDatePicker
            label="End Date"
            name="end"
            value={chartDate.end}
            onchange={handleSearchDate}
            maxDate={todayDate}
            className="form-item-animation"
            sx={{
              opacity: 0,
              animationDelay: "0.05s",
            }}
            error={chartDateError.end}
          />
        </Grid>
        <Grid container item lg={1} xs={2}>
          <StyledButtonPrimary
            style={{ width: "100%" }}
            onClick={chartLoad}
            disabled={startBoard}
          >
            <CachedIcon />
          </StyledButtonPrimary>
        </Grid>
      </Grid>
      <Grid container item xs={12} sx={{ position: "relative" }}>
        <StyledProgressLoading
          isloading={chartLoading.isLoading}
          value={chartLoading.progress}
        />
        <Line options={options} data={state} style={{ width: "100%" }} />
      </Grid>
    </Grid>
  );
}

ChartBoard.propTypes = {
  searchedVal: PropTypes.object.isRequired,
  tableLoading: PropTypes.bool.isRequired,
};
