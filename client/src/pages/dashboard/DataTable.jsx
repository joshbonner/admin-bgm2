import PropTypes from "prop-types";
import React from "react";
import { Button, Grid, Link, TextField } from "@mui/material";
import StyledTable from "../../components/styled-elements/table/StyledTable";
import DeleteIcon from "@mui/icons-material/Delete";
import isEmpty from "is-empty";
import { deleteRevenue } from "../../api/revenues";
import style from "styled-components";
import TotalCards from "./TotalCards";
import CheckIcon from "@mui/icons-material/Check";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CloseIcon from "@mui/icons-material/Close";
import muiStyled from "@mui/styled-engine";
import {
  updateFacebookBudget,
  updateSnapchatBudgetAndStatus,
  updateTiktokBudget,
} from "../../api/dailyBuget";
import { StyledStatusSwitch } from "../../components/styled-elements/StyledSwitch";
import { changeFacebookStatus, changeTiktokStatus } from "../../api/status";
import HourlyTable from "./HourlyTable";

const P = style.p`
  margin: 0;
`;

const StyledBudgetEditor = muiStyled(TextField)(({ theme }) => ({
  padding: "0 !important",
  width: "100%",
  "& input": {
    padding: "5px",
  },
}));

export default function DataTable({
  ondelete,
  revenues,
  setRevenues,
  isLoading,
  hourlyRoas,
}) {
  const initialTotal = {
    name: "Total",
    revenue: 0,
    spend: 0,
    profit: 0,
    roas: 0,
  };
  const [total, setTotal] = React.useState(initialTotal);
  const [budgetUpdate, setBudgetUpdate] = React.useState([]);

  React.useEffect(() => {
    if (revenues.length !== 0) {
      setTotal(initialTotal);
      var totalVal = {
        name: "Total",
        revenue: 0,
        spend: 0,
        profit: 0,
        roas: 0,
      };
      var ind = 0;
      revenues.forEach((item) => {
        totalVal.revenue += Number(item.revenue);
        totalVal.spend += Number(item.spend);
        if (item.roas !== 0) {
          totalVal.roas += Number(item.roas);
          ind++;
        }
      });
      totalVal.profit = Number(totalVal.revenue - totalVal.spend).toFixed(2);
      totalVal.revenue = Number(totalVal.revenue).toFixed(2);
      totalVal.spend = Number(totalVal.spend).toFixed(2);
      totalVal.roas = Number(totalVal.revenue / totalVal.spend).toFixed(2);
      setTotal(totalVal);
    } else {
      setTotal(initialTotal);
      setBudgetUpdate([]);
    }
  }, [revenues]);

  // Delete Revenue Data each row
  const handleRevenueDelete = async (key) => {
    const _id = await deleteRevenue(key);
    if (_id === "server_error") return;
    var index = 1;
    ondelete(
      revenues
        .filter((item) => item._id !== _id)
        .map((item) => ({ ...item, no: index++ })),
    );
  };

  const handleBudgetUpdate = (e) => {
    var budgets = budgetUpdate;
    budgets = budgets.map((item) => {
      if (e.target.name === item.id) {
        item.value = e.target.value;
        return {
          id: item.id,
          value: e.target.value,
        };
      }
    });
    setBudgetUpdate(budgets);
  };

  const handleUpdatedBudgetSave = async (_id) => {
    var update = revenues.filter((item) => item._id === _id)[0];
    update.budget = budgetUpdate.filter((item) => item.id === _id)[0].value;

    var response;
    switch (update.adsType) {
      case "facebook":
        response = await updateFacebookBudget(update);
        if (response.success !== true) {
          alert("Can't modify the budget");
          return;
        }
        break;
      case "tiktok":
        response = await updateTiktokBudget(update);
        if (response.message !== "OK") {
          alert("Can't modify the budget");
          return;
        }
        break;
      case "snapchat":
        response = await updateSnapchatBudgetAndStatus(
          update.snapchatItem.adsquad.campaign_id,
          update.snapchatItem.adsquad,
          {
            name: "budget",
            value: update.budget,
          },
        );
        if (!response) break;
        break;
      default:
    }

    setRevenues(
      revenues.map((item) => {
        if (item._id === _id) {
          item.budget = update.budget;
        }
        return item;
      }),
    );
    setBudgetUpdate(budgetUpdate.filter((item) => item.id !== _id));
  };

  const changeStatus = async (item) => {
    var response;
    switch (item.adsType) {
      case "tiktok":
        response = await changeTiktokStatus(
          item.account_token,
          item.advertiser_id,
          item.campaignId,
          item.status ? false : true,
        );
        setRevenues(
          revenues.map((i) => {
            if (i._id === item._id) {
              i.status = item.status ? false : true;
            }
            return i;
          }),
        );
        break;
      case "facebook":
        response = await changeFacebookStatus(
          item.adset_id,
          item.status ? false : true,
        );
        if (!response) break;
        if (!response.success) break;
        setRevenues(
          revenues.map((i) => {
            if (i._id === item._id) {
              i.status = item.status ? false : true;
            }
            return i;
          }),
        );
        break;
      case "snapchat":
        response = await updateSnapchatBudgetAndStatus(
          item.snapchatItem.adsquad.campaign_id,
          item.snapchatItem.adsquad,
          {
            name: "status",
            value: item.status ? "PAUSED" : "ACTIVE",
          },
        );
        if (!response) break;
        setRevenues(
          revenues.map((i) => {
            if (i._id === item._id) {
              i.status = item.status ? false : true;
            }
            return i;
          }),
        );
        break;
      default:
    }
  };

  const columns = [
    {
      id: "no",
      align: "center",
      label: "no",
      style: {
        width: "10px",
      },
    },
    {
      id: "icon",
      align: "center",
      label: "",
      render: (icon, item) =>
        icon === "" ? (
          <p></p>
        ) : (
          <img
            width={23}
            height={23}
            style={{ borderRadius: "50%" }}
            alt={`${item.name}`}
            src={`${icon}`}
          />
        ),
    },
    {
      id: "name",
      align: "left",
      label: "Name",
      columnAlign: "left",
      style: {
        width: "30%",
      },
      sort: true,
      sorter: (a, b) => a.name - b.name,
    },
    {
      id: "status",
      align: "left",
      label: "Status",
      columnAlign: "center",
      render: (status, item) => (
        <React.Fragment>
          {status !== undefined && (
            <StyledStatusSwitch
              checked={status}
              onChange={() => changeStatus(item)}
            />
          )}
        </React.Fragment>
      ),
    },
    {
      id: "budget",
      align: "center",
      label: "Budget",
      sort: true,
      render: (budget, item) => (
        <React.Fragment>
          {budgetUpdate.filter((i) => i.id === item._id).length !== 0 ? (
            <Grid direction={"row"} container item xs={12}>
              <Grid item container xs={6}>
                <StyledBudgetEditor
                  id={`${item._id}-budget-edit`}
                  name={`${item._id}`}
                  value={budgetUpdate.filter((i) => i.id === item._id)[0].value}
                  onChange={handleBudgetUpdate}
                  variant="outlined"
                />
              </Grid>
              <Grid item container xs={6} direction={"row"}>
                <Link
                  component="button"
                  color={"#44730e"}
                  onClick={() => handleUpdatedBudgetSave(item._id)}
                >
                  <CheckIcon style={{ width: "20px", height: "20px" }} />
                </Link>
                <Link
                  component="button"
                  color={"#c90000"}
                  onClick={() =>
                    setBudgetUpdate(
                      budgetUpdate.filter((i) => i.id !== item._id),
                    )
                  }
                >
                  <CloseIcon style={{ width: "20px", height: "20px" }} />
                </Link>
              </Grid>
            </Grid>
          ) : (
            <React.Fragment>
              ${budget}
              <span> </span>
              <Link
                component="button"
                color={"#fff"}
                onClick={() =>
                  setBudgetUpdate([
                    ...budgetUpdate,
                    { id: item._id, value: budget },
                  ])
                }
              >
                <ModeEditIcon fontSize="10" />
              </Link>
            </React.Fragment>
          )}
        </React.Fragment>
      ),
    },
    {
      id: "revenue",
      align: "center",
      label: "Revenue",
      sort: true,
      render: (revenue) => <P>{`$${revenue.toFixed(2)}`}</P>,
    },
    {
      id: "spend",
      align: "center",
      label: "Spend",
      sort: true,
      render: (spend) => <P>{`$${Number(spend).toFixed(2)}`}</P>,
    },
    {
      id: "profit",
      align: "center",
      label: "Profit",
      sort: true,
      render: (profit) => (
        <P
          style={
            profit > 0
              ? { color: "#2BC605" }
              : profit < 0
              ? { color: "#FF2020" }
              : { color: "#fff" }
          }
        >
          {`$${Number(profit).toFixed(2)}`}
        </P>
      ),
    },
    {
      id: "roas",
      align: "center",
      label: "ROAS",
      sort: true,
      render: (roas) => (
        <P>
          {(Number(roas) * 100).toFixed() === "Infinity"
            ? "Infinity"
            : (Number(roas) * 100).toFixed() + " %"}
        </P>
      ),
    },
    {
      id: "delete",
      align: "center",
      label: "",
      style: {
        padding: "0",
        width: "30px",
      },
      sort: true,
      render: (item, col) => (
        <Button
          style={{ cursor: "pointer", padding: "0" }}
          onClick={() => handleRevenueDelete(col.key)}
        >
          <DeleteIcon style={{ color: "red" }} />
        </Button>
      ),
    },
  ];

  return (
    <Grid item container xs={12} rowSpacing={1}>
      <TotalCards total={total} />
      <HourlyTable roas={hourlyRoas} isLoading={isLoading} />
      <br />
      <StyledTable
        isLoading={isLoading}
        columns={columns}
        data={
          isEmpty(revenues)
            ? []
            : revenues.map((item) => ({ ...item, key: item._id }))
        }
        totalRow={total}
        total={true}
        className="bounce-up"
      />
    </Grid>
  );
}

DataTable.propTypes = {
  isLoading: PropTypes.bool,
  ondelete: PropTypes.func,
  revenues: PropTypes.array.isRequired,
  total: PropTypes.object,
  setRevenues: PropTypes.func,
  hourlyRoas: PropTypes.array.isRequired,
};
