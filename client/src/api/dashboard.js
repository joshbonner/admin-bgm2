import isEmpty from "is-empty";
import api from "../utils/api";
import {
  getInfuse,
  getPlug,
  getTapp,
  getFluent,
  getAffiliate,
  getAragonAndPanelXyz,
} from "./mediaApi";
import {
  getTiktok_adgroup,
  getTiktok_campaign,
  getSnapchatAds,
  getFacebookAds,
} from "./adsApi";
import { getData as getSnapSets } from "./snapchat";
import { getFacebookStatusBatch, getTiktokStatus } from "./status";
import { getSnapchatBudgetAndStatus } from "./dailyBuget";

export const getDataByConnection = (
  start,
  end,
  plugAccounts,
  adAccounts,
  default_timezone,
) => {
  return api
    .get(`revenue`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(async (res) => {
      const data = res.data;
      var mediaSources = [];

      // Get Plug Data
      // BGM Affiliate data
      if (plugAccounts.filter((item) => item === "affiliate").length !== 0) {
        const affiliateData = await getAffiliate(start, end);
        if (!isEmpty(affiliateData)) {
          mediaSources = [
            ...affiliateData.map((item) => ({
              icon: "",
              name: item.name,
              revenue: parseFloat(item.revenue),
              offer: "",
              plugAccount: "affiliate",
            })),
          ];
        }
      }

      // infuse data
      if (plugAccounts.filter((item) => item === "infuse").length !== 0) {
        const infuseData = await getInfuse(start, end);
        if (!isEmpty(infuseData)) {
          mediaSources = [
            ...infuseData.map((item) => ({
              icon: "",
              name: item.Stat.source,
              revenue: parseFloat(item.Stat.payout),
              offer: "",
              plugAccount: "infuse",
            })),
          ];
        }
      }

      // tapp data
      if (plugAccounts.filter((item) => item === "tapp").length !== 0) {
        const tappData = await getTapp(start, end);
        if (!isEmpty(tappData)) {
          mediaSources = [
            ...tappData.map((item) => ({
              icon: "",
              name: item.Stat.source,
              revenue: parseFloat(item.Stat.payout),
              offer: "",
              plugAccount: "tapp",
            })),
          ];
        }
      }

      if (plugAccounts.filter((item) => item === "aragon").length !== 0) {
        const aragonData = await getAragonAndPanelXyz(start, end, "aragon");
        if (!isEmpty(aragonData)) {
          mediaSources = [
            ...aragonData.map((item) => ({
              icon: "",
              name: item.id,
              revenue: item.revenue,
              offer: "",
              plugAccount: "aragon",
            })),
          ];
        }
      }

      if (plugAccounts.filter((item) => item === "panelxyz").length !== 0) {
        const panelXyz = await getAragonAndPanelXyz(start, end, "panelxyz");
        if (!isEmpty(panelXyz)) {
          mediaSources = [
            ...panelXyz.map((item) => ({
              icon: "",
              name: item.id,
              revenue: item.revenue,
              offer: "",
              plugAccount: "panelxyz",
            })),
          ];
        }
      }

      if (plugAccounts.filter((item) => item === "fluent").length !== 0) {
        // fluent data
        const fluentData = await getFluent(start, end);
        if (!isEmpty(fluentData)) {
          mediaSources = [
            ...fluentData.map((item) => ({
              icon: "",
              name: item.sub_id,
              revenue: parseFloat(item.revenue),
              offer: "",
              plugAccount: "fluent",
            })),
          ];
        }
      }

      var plugData;
      for (const element of plugAccounts) {
        if (
          element === "infuse" ||
          element === "tapp" ||
          element === "fluent" ||
          element === "affiliate" ||
          element === "aragon" ||
          element === "panelxyz"
        )
          continue;
        plugData = await getPlug(start, end, element, default_timezone);
        mediaSources = [
          ...mediaSources,
          ...plugData.map((item) => ({
            icon: item.campaign_image_url,
            name: item.media_name,
            revenue: parseFloat(item.dollars),
            offer: item.campaign_name,
            plugAccount: "element",
          })),
        ];
      }

      // Get Advertising Data
      var adSets = [];
      // Get Facebook ADS Data
      for (let element of adAccounts) {
        if (element.accountType !== "facebook") continue;
        const facebookData = await getFacebookAds(start, end, element.token);
        if (isEmpty(facebookData.data)) continue;
        var facebookAdsets = [],
          adsetIds = [];
        for (let item of facebookData.data) {
          adsetIds.push(item.adset_id);
          facebookAdsets = [
            ...facebookAdsets,
            {
              account_token: element.token,
              adgroupName: item.adset_name,
              campaignId: item.adset_name,
              adset_id: item.adset_id, // only facebook
              spend: Number(item.spend),
              budget: Number(item.daily_budget) / 100,
              adsType: element.accountType,
              adAccount: element.name,
            },
          ];
        }
        const statusSet = await getFacebookStatusBatch(adsetIds);
        facebookAdsets = facebookAdsets.map((item) => {
          const f_status = statusSet.filter((i) => {
            return JSON.parse(i.body).id === item.adset_id;
          })[0];
          return {
            ...item,
            status:
              JSON.parse(f_status.body).status === "ACTIVE"
                ? true
                : JSON.parse(f_status.body).status === "PAUSED"
                ? false
                : undefined,
          };
        });
        adSets = [
          ...adSets,
          ...(isEmpty(facebookData.data) ? [] : facebookAdsets),
        ];
      }

      // Add Tiktok ADS Data
      var tiktokData = [];
      for (let element of adAccounts) {
        if (element.accountType !== "tiktok") continue;
        tiktokData = await getTiktok_adgroup(start, end, element);
        const tiktokStatus = await getTiktokStatus(
          element.accessToken,
          element.token,
        );
        adSets = [
          ...adSets,
          ...(isEmpty(tiktokData)
            ? []
            : tiktokData.list.map((item) => {
                var status = tiktokStatus.filter(
                  (i) => i.adgroup_id === item.dimensions.adgroup_id,
                )[0];
                if (status !== undefined) {
                  status =
                    status.operation_status === "ENABLE"
                      ? true
                      : status.operation_status === "DISABLE"
                      ? false
                      : undefined;
                }
                return {
                  campaignId: item.dimensions.adgroup_id,
                  spend: Number(item.metrics.spend),
                  adgroupName: item.metrics.adgroup_name,
                  budget: Number(item.metrics.budget),
                  account_token: element.accessToken,
                  advertiser_id: element.token,
                  adsType: element.accountType,
                  status: status,
                  adAccount: element.name,
                };
              })),
        ];
      }

      for (let element of adAccounts) {
        if (element.accountType !== "tiktok") continue;
        tiktokData = await getTiktok_campaign(start, end, element);
        adSets = [
          ...adSets,
          ...(isEmpty(tiktokData)
            ? []
            : tiktokData.list.map((item) => ({
                campaignId: item.dimensions.campaign_id,
                spend: Number(item.metrics.spend),
                adgroupName: item.metrics.campaign_name,
                budget: null,
                adsType: element.accountType,
                adAccount: element.name,
              }))),
        ];
      }

      // Add Snapchat ADS Data
      for (let element of adAccounts) {
        if (element.accountType !== "snapchat") continue;

        const snapCampaignResult = await getSnapchatAds(
          start,
          end,
          element.token,
          "campaign",
        );
        const snapchatBudgetAndStatus = await getSnapchatBudgetAndStatus(
          element.token,
        );
        if (snapCampaignResult.request_status !== "ERROR") {
          const snapchatData =
            snapCampaignResult.total_stats[0].total_stat.breakdown_stats
              .campaign;
          var snapsets = await getSnapSets();
          snapsets = snapsets
            .filter(
              (item) =>
                snapchatData.filter((i) => item.token === i.id).length !== 0,
            )
            .map((item) => {
              const matched = snapchatData.filter(
                (i) => item.token === i.id,
              )[0];
              return {
                adgroupName: item.name,
                campaignId: item.token,
                spend: Number(matched.stats.spend) / 1000000,
                budget: null,
                adsType: element.accountType,
                adAccount: element.name,
              };
            });
          adSets = [...adSets, ...snapsets];
        } else {
          console.log(snapCampaignResult.debug_message);
        }

        const snapAdResult = await getSnapchatAds(
          start,
          end,
          element.token,
          "adsquad",
        );
        if (snapAdResult.request_status !== "ERROR") {
          const snapchatData =
            snapAdResult.total_stats[0].total_stat.breakdown_stats.adsquad;
          snapsets = await getSnapSets();
          snapsets = snapsets
            .filter(
              (item) =>
                snapchatData.filter((i) => item.token === i.id).length !== 0,
            )
            .map((item) => {
              const matched = snapchatData.filter(
                (i) => item.token === i.id,
              )[0];
              const budgetItem = snapchatBudgetAndStatus.filter(
                (b) => b.adsquad.id === item.token,
              )[0];
              return {
                adgroupName: item.name,
                campaignId: item.token,
                spend: Number(matched.stats.spend) / 1000000,
                adsType: element.accountType,
                adAccount: element.name,
                budget:
                  budgetItem === undefined
                    ? null
                    : Number(budgetItem.adsquad.daily_budget_micro) / 1000000,
                status:
                  budgetItem === undefined
                    ? null
                    : budgetItem.adsquad.status === "PAUSED"
                    ? false
                    : true,
                snapchatItem: budgetItem,
              };
            });
          adSets = [...adSets, ...snapsets];
        } else {
          console.log(snapAdResult.debug_message);
        }
      }

      // Combination
      var index = 1;
      const result = [];

      data.forEach((item) => {
        var isMatch =
          mediaSources.filter((i) => i.name === item.name).length !== 0
            ? true
            : false;
        if (isMatch) {
          const media = mediaSources.filter((i) => item.name === i.name)[0];
          const adset = adSets.filter(
            (ad) => ad.campaignId === item.campaignId,
          )[0];
          if (!isEmpty(adset)) {
            result.push({
              no: index++,
              _id: item._id,
              icon: media.icon,
              campaignId: item.campaignId,
              name: item.name,
              roas:
                media.revenue === 0 || adset.spend === 0
                  ? 0
                  : media.revenue / adset.spend,
              profit: media.revenue - adset.spend,
              revenue: media.revenue,
              spend: adset.spend,
              offer: media.offer,
              budget: adset.budget,
              advertiser_id: adset.advertiser_id,
              account_token: adset.account_token,
              adsType: adset.adsType,
              adset_id: adset.adset_id, // only facebook
              status: adset.status !== undefined ? adset.status : undefined,
              plugAccount: media.plugAccount,
              adAccount: adset.adAccount,
              snapchatItem: adset.snapchatItem ? adset.snapchatItem : undefined,
            });
          }
        }
      });
      return result;
    })
    .catch((err) => {
      return [];
    });
};

export const getOnlyRevenues = async (start, end, plugAccounts, timezone) => {
  var mediaSources = [];

  // Infuse Data
  if (plugAccounts.filter((item) => item === "infuse").length !== 0) {
    const infuseData = await getInfuse(start, end);
    if (!isEmpty(infuseData)) {
      mediaSources = [
        ...infuseData.map((item) => ({
          name: item.Stat.source,
          revenue: parseFloat(item.Stat.payout),
        })),
      ];
    }
  }

  // Top Data
  if (plugAccounts.filter((item) => item === "tapp").length !== 0) {
    const tappData = await getTapp(start, end);
    if (!isEmpty(tappData)) {
      mediaSources = [
        ...tappData.map((item) => ({
          name: item.Stat.source,
          revenue: parseFloat(item.Stat.payout),
        })),
      ];
    }
  }

  // fluent data
  if (plugAccounts.filter((item) => item === "fluent").length !== 0) {
    const fluentData = await getFluent(start, end);
    if (!isEmpty(fluentData)) {
      mediaSources = [
        ...fluentData.map((item) => ({
          icon: "",
          name: item.sub_id,
          revenue: parseFloat(item.revenue),
          offer: "",
        })),
      ];
    }
  }

  if (plugAccounts.filter((item) => item === "aragon").length !== 0) {
    const aragonData = await getAragonAndPanelXyz(start, end, "aragon");
    if (!isEmpty(aragonData)) {
      mediaSources = [
        ...aragonData.map((item) => ({
          icon: "",
          name: item.id,
          revenue: item.revenue,
          offer: "",
        })),
      ];
    }
  }

  if (plugAccounts.filter((item) => item === "panelxyz").length !== 0) {
    const panelXyz = await getAragonAndPanelXyz(start, end, "panelxyz");
    if (!isEmpty(panelXyz)) {
      mediaSources = [
        ...panelXyz.map((item) => ({
          icon: "",
          name: item.id,
          revenue: item.revenue,
          offer: "",
        })),
      ];
    }
  }

  // Plug Data
  var plugData;
  for (const element of plugAccounts) {
    if (
      element === "infuse" ||
      element === "tapp" ||
      element === "fluent" ||
      element === "affiliate" ||
      element === "aragon" ||
      element === "panelxyz"
    )
      continue;
    plugData = await getPlug(start, end, element, timezone);
    mediaSources = [
      ...mediaSources,
      ...plugData.map((item) => ({
        name: item.media_name,
        revenue: parseFloat(item.dollars),
      })),
    ];
  }
  return mediaSources;
};

export const getOnlySpends = async (start, end, advertiser_id) => {
  var tiktokData = [];
  var adSets = [];

  // Get Tiktok Spends
  tiktokData = [];
  for (let element of advertiser_id) {
    if (element.accountType !== "tiktok") continue;
    tiktokData = await getTiktok_adgroup(start, end, element);
    const tiktokStatus = await getTiktokStatus(
      element.accessToken,
      element.token,
    );
    adSets = [
      ...adSets,
      ...(isEmpty(tiktokData)
        ? []
        : tiktokData.list.map((item) => {
            var status = tiktokStatus.filter(
              (i) => i.adgroup_id === item.dimensions.adgroup_id,
            )[0];
            if (status !== undefined) {
              status =
                status.operation_status === "ENABLE"
                  ? true
                  : status.operation_status === "DISABLE"
                  ? false
                  : undefined;
            }
            return {
              campaignId: item.dimensions.adgroup_id,
              spend: Number(item.metrics.spend),
              adgroupName: item.metrics.adgroup_name,
              budget: Number(item.metrics.budget),
              account_token: element.accessToken,
              advertiser_id: element.token,
              adsType: element.accountType,
              status: status,
            };
          })),
    ];
  }

  for (let element of advertiser_id) {
    if (element.accountType !== "tiktok") continue;
    tiktokData = await getTiktok_campaign(start, end, element);
    adSets = [
      ...adSets,
      ...(isEmpty(tiktokData)
        ? []
        : tiktokData.list.map((item) => ({
            campaignId: item.dimensions.campaign_id,
            spend: Number(item.metrics.spend),
            budget: null,
            adsType: element.accountType,
          }))),
    ];
  }

  // Get Snapchat Spends
  for (let element of advertiser_id) {
    if (element.accountType !== "snapchat") continue;

    const snapCampaignResult = await getSnapchatAds(
      start,
      end,
      element.token,
      "campaign",
    );
    if (snapCampaignResult.request_status !== "ERROR") {
      const snapchatData =
        snapCampaignResult.total_stats[0].total_stat.breakdown_stats.campaign;
      var snapsets = await getSnapSets();
      snapsets = snapsets
        .filter(
          (item) =>
            snapchatData.filter((i) => item.token === i.id).length !== 0,
        )
        .map((item) => {
          const matched = snapchatData.filter((i) => item.token === i.id)[0];
          return {
            adgroupName: item.name,
            campaignId: item.token,
            spend: Number(matched.stats.spend) / 1000000,
            budget: null,
            adsType: element.accountType,
          };
        });
      adSets = [...adSets, ...snapsets];
    } else {
      console.log(snapCampaignResult.debug_message);
    }

    const snapAdResult = await getSnapchatAds(
      start,
      end,
      element.token,
      "adsquad",
    );
    if (snapAdResult.request_status !== "ERROR") {
      const snapchatData =
        snapAdResult.total_stats[0].total_stat.breakdown_stats.adsquad;
      snapsets = await getSnapSets();
      snapsets = snapsets
        .filter(
          (item) =>
            snapchatData.filter((i) => item.token === i.id).length !== 0,
        )
        .map((item) => {
          const matched = snapchatData.filter((i) => item.token === i.id)[0];
          return {
            adgroupName: item.name,
            campaignId: item.token,
            spend: Number(matched.stats.spend) / 1000000,
            budget: null,
            adsType: element.accountType,
          };
        });
      adSets = [...adSets, ...snapsets];
    } else {
      console.log(snapAdResult.debug_message);
    }
  }

  // Get Facebook Spends
  for (let element of advertiser_id) {
    if (element.accountType !== "facebook") continue;
    const facebookData = await getFacebookAds(start, end, element.token);
    if (isEmpty(facebookData.data)) continue;
    var facebookAdsets = [],
      adsetIds = [];
    for (let item of facebookData.data) {
      adsetIds.push(item.adset_id);
      facebookAdsets = [
        ...facebookAdsets,
        {
          account_token: element.token,
          adgroupName: item.adset_name,
          campaignId: item.adset_name,
          adset_id: item.adset_id, // only facebook
          spend: Number(item.spend),
          budget: Number(item.daily_budget) / 100,
          adsType: element.accountType,
        },
      ];
    }
    const statusSet = await getFacebookStatusBatch(adsetIds);
    facebookAdsets = facebookAdsets.map((item) => {
      const f_status = statusSet.filter((i) => {
        return JSON.parse(i.body).id === item.adset_id;
      })[0];
      return {
        ...item,
        status:
          JSON.parse(f_status.body).status === "ACTIVE"
            ? true
            : JSON.parse(f_status.body).status === "PAUSED"
            ? false
            : undefined,
      };
    });
    adSets = [...adSets, ...(isEmpty(facebookData.data) ? [] : facebookAdsets)];
  }

  return adSets;
};
