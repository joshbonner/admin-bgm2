import React from "react";
import { useNavigate } from "react-router";
import isEmpty from "is-empty";
import { Grid, Typography } from "@mui/material";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import { StyledCard } from "../../components/styled-elements/styledCard";
import StyledDatePicker from "../../components/styled-elements/StyledDatePicker";
import MediaList from "../../components/connect-components/MediaList";
import AdSetList from "../../components/connect-components/AdSetList";
import ConnectedList from "../../components/connect-components/ConnectedList";
import StyledSelect from "../../components/styled-elements/StyledSelect";
import { addRevenue, getRevenues } from "../../api/revenues";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  StyledButtonPrimary,
  StyledButtonSuccess,
} from "../../components/styled-elements/buttonStyles";
import { getData as getAccounts } from "../../api/accounts";
import { getData as getSnapSets } from "../../api/snapchat";
import {
  getFacebookAds,
  getSnapchatAds,
  getTiktok_adgroup,
  getTiktok_campaign,
} from "../../api/adsApi";
import {
  getAffiliate,
  getAragonAndPanelXyz,
  getFluent,
  getInfuse,
  getPlug,
  getTapp,
} from "../../api/mediaApi";
import addNotification from "react-push-notification";
import StyledDateRangePicker from "../../components/styled-elements/StyledDateRangePicker";

dayjs.extend(utc);
dayjs.extend(timezone);

const AdManager = () => {
  const initialState = {
    startDate: dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD"),
    endDate: dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD"),
    plugAccount: null,
    adAccount: null,
    mediaSources: [],
    adSets: [],
    data: [],
    isMediaLoading: false,
    isAdLoading: false,
    pair: {
      dataType: "",
      dataKey: 0,
    },
    pairComplete: false,
    accountType: "",
  };

  const initialErrors = {
    plug: "",
    adAccount: "",
    start: "",
    end: "",
  };

  const [errors, setErrors] = React.useState(initialErrors);
  const [state, setState] = React.useState(initialState);
  const navigate = useNavigate();
  const [accounts, setAccounts] = React.useState([]);

  React.useEffect(() => {
    getInitAccounts();
  }, []);

  const getInitAccounts = async () => {
    const result = await getAccounts();
    setAccounts(result);
  };

  const handleSearchDate = (e) => setState({ ...state, [e.name]: e.value });

  const automaticConnection = () => {
    if (!isEmpty(state.mediaSources) && !isEmpty(state.adSets)) {
      var index = state.data.length + 1;
      const connected = [];
      state.mediaSources.forEach((item) => {
        state.adSets.forEach((ad) => {
          if (ad.adgroupName === item.name && !isEmpty(item.name)) {
            if (state.data.filter((d) => d.name === item.name).length === 0)
              connected.push({ ...item, ...ad, no: index++ });
          }
        });
      });
      setState({
        ...state,
        mediaSources: state.mediaSources.filter(
          (item) =>
            connected.map((i) => i.name).filter((i) => i === item.name)
              .length === 0,
        ),
        adSets: state.adSes.filter(
          (item) =>
            connected.map((i) => i.name).filter((i) => i === item.adgroupName)
              .length === 0,
        ),
        data: [...connected, state.data],
      });
    }
  };

  const excludeConnectedRevenues = async (contentType, contentVal) => {
    const savedRevenue = await getRevenues();
    if (savedRevenue === "server_error") return;
    if (contentType === "media") {
      return contentVal.filter(
        (item) => savedRevenue.filter((i) => i.name === item.name).length === 0,
      );
    } else if (contentType === "adsets") {
      return contentVal.filter(
        (item) =>
          savedRevenue.filter((i) => i.campaignId === item.campaignId)
            .length === 0,
      );
    }
  };

  const getMediaSource = async () => {
    if (isEmpty(state.plugAccount)) {
      setErrors({ ...errors, plug: "Choose the account" });
      return;
    }
    setErrors(initialErrors);
    setState({ ...state, isMediaLoading: true, mediaSources: [] });
    var mediaSources = [];
    var index = 0;
    switch (state.plugAccount.id) {
      case "affiliate":
        const bgmAffiliateData = await getAffiliate(
          state.startDate,
          state.endDate,
        );
        mediaSources = bgmAffiliateData.map((item) => ({
          no: index++,
          icon: "",
          name: item.name,
          revenue: item.value,
        }));
        break;
      case "infuse":
        const infuseData = await getInfuse(state.startDate, state.endDate);
        mediaSources = infuseData.map((item) => ({
          no: index++,
          icon: "",
          name: isEmpty(item.Stat.source) ? "(empty)" : item.Stat.source,
          revenue: parseFloat(item.Stat.payout),
        }));
        break;
      case "tapp":
        const tappData = await getTapp(state.startDate, state.endDate);
        mediaSources = tappData.map((item) => ({
          no: index++,
          icon: "",
          name: isEmpty(item.Stat.source) ? "(empty)" : item.Stat.source,
          revenue: parseFloat(item.Stat.payout),
        }));
        break;
      case "fluent":
        const fluentData = await getFluent(state.startDate, state.endDate);
        mediaSources = fluentData.map((item) => ({
          no: index++,
          icon: "",
          name: isEmpty(item.sub_id) ? "(empty)" : item.sub_id,
          revenue: parseFloat(item.revenue),
        }));
        break;
      case "aragon":
        const aragonData = await getAragonAndPanelXyz(
          state.startDate,
          state.endDate,
          "aragon",
        );
        mediaSources = aragonData.map((item) => ({
          no: index++,
          icon: "",
          name: item.id,
          revenue: parseFloat(item.revenue),
        }));
        break;
      case "panelxyz":
        const panelXyzDat = await getAragonAndPanelXyz(
          state.startDate,
          state.endDate,
          "panelxyz",
        );
        mediaSources = panelXyzDat.map((item) => ({
          no: index++,
          icon: "",
          name: item.id,
          revenue: parseFloat(item.revenue),
        }));
        break;
      default:
        const plugData = await getPlug(
          state.startDate,
          state.endDate,
          state.plugAccount.id,
        );
        mediaSources = [
          ...plugData.map((item) => ({
            no: index++,
            icon: item.campaign_image_url,
            name: isEmpty(item.media_name) ? "(empty)" : item.media_name,
            revenue: parseFloat(item.dollars),
          })),
        ];
    }

    mediaSources = await excludeConnectedRevenues("media", mediaSources);
    setState({ ...state, mediaSources: mediaSources, isMediaLoading: false });
    automaticConnection();
  };

  const getAdSets = async () => {
    if (isEmpty(state.adAccount)) {
      setErrors({ ...errors, adAccount: "Choose the account" });
      return;
    }
    setErrors(initialErrors);
    setState({ ...state, isAdLoading: true, adSets: [] });
    var adSets = [];
    var index = 1;
    switch (state.adAccount.accountType) {
      case "snapchat":
        const result = await getSnapchatAds(
          state.startDate,
          state.endDate,
          state.adAccount.id,
          "adsquad",
        );
        if (result.request_status === "ERROR") {
          setState({ ...state, isAdLoading: true, adSets: [] });
          return alert(result.debug_message);
        }
        if (result === "server_error") return;
        const snapads =
          result.total_stats[0].total_stat.breakdown_stats.adsquad;
        const snapsets = await getSnapSets();

        adSets = snapsets
          .filter(
            (item) =>
              snapads.filter(
                (i) =>
                  item.accountType === "snapchat" &&
                  item.idType === "adset" &&
                  item.token === i.id,
              ).length !== 0,
          )
          .map((item) => ({
            no: index++,
            adgroupName: item.name,
            campaignId: item.token,
          }));
        break;
      case "tiktok":
        const tiktokData = await getTiktok_adgroup(
          state.startDate,
          state.endDate,
          state.adAccount,
        );
        if (tiktokData === "server_error") return;
        if (!isEmpty(tiktokData)) {
          adSets = tiktokData.list.map((item) => ({
            no: index++,
            campaignId: item.dimensions.adgroup_id,
            adgroupName: item.metrics.adgroup_name,
          }));
        }
        break;
      case "facebook":
        const facebookData = await getFacebookAds(
          state.startDate,
          state.endDate,
          state.adAccount.token,
        );
        if (isEmpty(facebookData.data)) {
          break;
        }
        adSets = facebookData.data.map((item) => ({
          no: index++,
          adgroupName: item.adset_name,
          campaignId: item.adset_name,
        }));
        break;
      default:
    }

    adSets = await excludeConnectedRevenues("adsets", adSets);
    setState({ ...state, adSets: adSets, isAdLoading: false });
    automaticConnection();
  };

  const getCampaigns = async () => {
    if (isEmpty(state.adAccount)) {
      setErrors({ ...errors, adAccount: "Choose the account" });
      return;
    }
    setErrors(initialErrors);
    setState({ ...state, isAdLoading: true, adSets: [] });
    var adSets = [];

    switch (state.adAccount.accountType) {
      case "snapchat":
        const result = await getSnapchatAds(
          state.startDate,
          state.endDate,
          state.adAccount.id,
          "campaign",
        );
        if (result.request_status === "ERROR") {
          setState({ ...state, isAdLoading: true, adSets: [] });
          return alert(result.debug_message);
        }
        if (result === "server_error") return;
        const snapads =
          result.total_stats[0].total_stat.breakdown_stats.campaign;

        const snapsets = await getSnapSets();
        var index = 1;
        adSets = snapsets
          .filter(
            (item) =>
              snapads.filter(
                (i) =>
                  item.accountType === "snapchat" &&
                  item.idType === "campaign" &&
                  item.token === i.id,
              ).length !== 0,
          )
          .map((item) => {
            return {
              no: index++,
              adgroupName: item.name,
              campaignId: item.token,
            };
          });
        break;
      case "tiktok":
        const tiktokData = await getTiktok_campaign(
          state.startDate,
          state.endDate,
          state.adAccount,
        );
        if (tiktokData === "server_error") return;
        var index = 1;
        if (!isEmpty(tiktokData)) {
          adSets = tiktokData.list.map((item) => ({
            no: index++,
            campaignId: item.dimensions.campaign_id,
            adgroupName: item.metrics.campaign_name,
          }));
        }
        break;
      case "facebook":
        const facebookData = await getFacebookAds(
          state.startDate,
          state.endDate,
          state.adAccount.token,
        );
        if (isEmpty(facebookData.data)) {
          return;
        }
        adSets = facebookData.data.map((item) => ({
          no: index++,
          adgroupName: item.adset_name,
          campaignId: item.adset_name,
        }));
        break;
      default:
    }

    adSets = await excludeConnectedRevenues("adsets", adSets);
    setState({ ...state, adSets: adSets, isAdLoading: false });
    automaticConnection();
  };

  const handleSourceChange = (dataType, dataKey) => {
    setState({ ...state, pair: { dataType: dataType, dataKey: dataKey } });
    const pair = state.pair;
    if (!isEmpty(pair.dataType) && dataType !== state.pair.dataType) {
      setState({
        ...state,
        data: [
          ...state.data,
          {
            ...state[dataType].filter((item) => item.no === dataKey)[0],
            ...state[pair.dataType].filter(
              (item) => item.no === pair.dataKey,
            )[0],
            [pair.dataType]: pair.dataKey,
            [dataType]: dataKey,
            no: state.data.length + 1,
          },
        ],
        [dataType]: state[dataType].filter((item) => item.no !== dataKey),
        [pair.dataType]: state[pair.dataType].filter(
          (item) => item.no !== pair.dataKey,
        ),
        pair: {
          dataType: "",
          dataKey: 0,
        },
      });
    }
  };

  const handleDataChange = (key) => {
    const removeData = state.data.filter((item) => item.no === key)[0];
    setState({
      ...state,
      mediaSources: [
        ...state.mediaSources,
        {
          no: removeData.mediaSources,
          name: removeData.name,
          offer: removeData.offer,
          revenue: removeData.revenue,
          icon: removeData.icon,
        },
      ],
      adSets: [
        ...state.adSets,
        {
          no: removeData.adSets,
          campaignId: removeData.campaignId,
          adgroupName: removeData.adgroupName,
        },
      ],
      data: state.data.filter((item) => item.no !== key),
    });
  };

  const handleDataRemove = () => {
    const mediaSource = state.data.map((item) => ({
      no: item.mediaSources,
      icon: item.icon,
      name: item.name,
      revenue: item.revenue,
      offer: item.offer,
    }));
    const adSets = state.data.map((item) => ({
      no: item.adSets,
      campaignId: item.campaignId,
      adgroupName: item.adgroupName,
    }));

    setState({
      ...state,
      mediaSources: [...state.mediaSources, mediaSource],
      adSets: [...state.adSets, adSets],
    });
  };

  const handleDataSave = async () => {
    const result = await addRevenue(
      state.data.map((item) => ({
        name: item.name,
        offer: item.offer,
        campaignId: item.campaignId,
        advertiserId: state.adAccount.id,
        bearerToken: state.plugAccount.id,
      })),
    );
    if (result === "server_error") return;
    addNotification({
      title: `200: Success!`,
      subtitle: `${state.data.length} items are connected!`,
      theme: "light",
      duration: 5000,
      native: false,
      closeButton: "X",
    });
    navigate("/");
  };

  const handleAccountSelect = (accountType, account) => {
    setState({
      ...state,
      [accountType]: account,
      accountType: account.accountType,
    });
  };

  return (
    <Grid container item xs={11} style={{ margin: "30px auto" }}>
      <StyledCard>
        <Grid container item direction={"column"} spacing={1}>
          <Grid container item direction={"row"} marginBottom={3}>
            <HubOutlinedIcon sx={{ fontSize: "33px" }} />
            <Typography style={{ padding: "0 15px", fontSize: "20px" }}>
              Account Setting
            </Typography>
          </Grid>
          <Grid
            container
            item
            xs={12}
            direction={"row"}
            spacing={1}
            justifyContent={"space-between"}
          >
            <Grid
              container
              item
              direction={"row"}
              spacing={1}
              lg={5}
              sm={6}
              xs={12}
            >
              <Grid container item xs={6}>
                <StyledSelect
                  name="plugAccount"
                  label="Plug Account"
                  onchange={handleAccountSelect}
                  data={[
                    ...accounts
                      .filter((item) => item.accountType === "plug")
                      .map((item) => ({
                        name: "Plug - " + item.name,
                        value: item.token,
                      })),
                    { name: "BGM Affiliate", value: "affiliate" },
                    { name: "Tapp", value: "tapp" },
                    { name: "Infuse", value: "infuse" },
                    { name: "Fluent", value: "fluent" },
                    { name: "Aragon", value: "aragon" },
                    { name: "Panel XYZ", value: "panelxyz" },
                  ]}
                  error={errors.plug}
                />
              </Grid>
              <Grid container item xs={6}>
                <StyledSelect
                  name="adAccount"
                  label="Ad Account"
                  onchange={handleAccountSelect}
                  data={accounts
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
                      name: (
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
                    }))}
                  error={errors.adAccount}
                  style={{ display: "flex" }}
                />
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction={"row"}
              spacing={1}
              xl={3}
              lg={5}
              sm={6}
              xs={12}
            >
              <Grid container item md={6} xs={6}>
                <StyledDatePicker
                  name="startDate"
                  label="Start Date"
                  maxDate={dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD")}
                  value={state.startDate}
                  onchange={handleSearchDate}
                />
              </Grid>
              <Grid container item md={6} xs={6}>
                <StyledDatePicker
                  name="endDate"
                  label="End Date"
                  maxDate={dayjs.tz(dayjs(), "EST").format("YYYY-MM-DD")}
                  minDate={state.startDate}
                  value={state.endDate}
                  onchange={handleSearchDate}
                />
              </Grid>
              {/*
              <StyledDateRangePicker
                onChange={(val) =>
                  setState({
                    ...state,
                    startDate: val.startDate,
                    endDate: val.endDate,
                  })
                }
              />
              */}
            </Grid>
          </Grid>
          <Grid container item xs={12} direction={"row"}>
            <Grid container item direction={"column"}>
              <Grid
                container
                item
                rowSpacing={1}
                justifyContent={"space-around"}
              >
                <Grid
                  container
                  item
                  spacing={2}
                  direction={"row"}
                  justifyContent={"space-between"}
                >
                  <Grid container item md={3} xs={6}>
                    <StyledButtonSuccess onClick={getMediaSource} fullWidth>
                      GET MEDIA SOURCES
                    </StyledButtonSuccess>
                  </Grid>
                  <Grid container item spacing={1} xs={6} md={3}>
                    <Grid container item xs={6}>
                      <StyledButtonSuccess onClick={getAdSets} fullWidth>
                        AD Group
                      </StyledButtonSuccess>
                    </Grid>
                    <Grid container item xs={6}>
                      <StyledButtonSuccess onClick={getCampaigns} fullWidth>
                        Campaigns
                      </StyledButtonSuccess>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  spacing={2}
                  direction={"row"}
                  justifyContent={"space-between"}
                >
                  <Grid container item md={3} xs={6}>
                    <MediaList
                      data={state.mediaSources}
                      isLoading={state.isMediaLoading}
                      onchange={handleSourceChange}
                    />
                  </Grid>
                  <Grid
                    container
                    item
                    sx={{ display: { md: "block", xs: "none" } }}
                    sm={6}
                  >
                    <ConnectedList
                      data={state.data}
                      onchange={handleDataChange}
                      onremove={handleDataRemove}
                    />
                    <StyledButtonPrimary
                      style={{ marginTop: "15px" }}
                      onClick={handleDataSave}
                      fullWidth
                      sx={{ padding: "10px" }}
                      disabled={state.data.length === 0 ? true : false}
                    >
                      Add Connection Revenues
                    </StyledButtonPrimary>
                  </Grid>
                  <Grid container item md={3} xs={6}>
                    <AdSetList
                      data={state.adSets}
                      isLoading={state.isAdLoading}
                      onchange={handleSourceChange}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  sx={{ display: { md: "none", xs: "block" } }}
                  md={5}
                >
                  <ConnectedList
                    data={state.data}
                    onchange={handleDataChange}
                    onremove={handleDataRemove}
                  />
                  <StyledButtonPrimary
                    style={{ marginTop: "15px" }}
                    onClick={handleDataSave}
                    fullWidth
                    sx={{ padding: "10px" }}
                    disabled={state.data.length === 0 ? true : false}
                  >
                    Add Connection Revenues
                  </StyledButtonPrimary>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </StyledCard>
    </Grid>
  );
};

export default AdManager;
