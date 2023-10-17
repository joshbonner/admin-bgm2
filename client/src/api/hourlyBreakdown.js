import { corsProxy } from "./general";
import { getTokenByName } from "./token";

export const getHourlyData = async (start, end, campaignIds, adAccountId) => {
  const revenues = await getHourlyRevenue(start, end);
  let result = revenues.map((item) => {
    let revenueSum = 0;
    item.sub_id1
      .filter(
        (t) => campaignIds.map((y) => y.name).indexOf(t.sub_id1.value) > -1,
      )
      .forEach((x) => {
        revenueSum += Number(x.approved_revenue);
      });

    return {
      hour: item.hour.hour,
      revenue: revenueSum,
      spend: 0,
    };
  });
  let spends;
  for (const i of adAccountId.filter(
    (item) => item.accountType === "facebook",
  )) {
    spends = await getHourlyFacebookSpend(start, end, i);
    spends.forEach((item) => {
      let time = item.hourly_stats_aggregated_by_advertiser_time_zone;
      if (time[0] === "0") {
        time = time[1];
      } else {
        time = time[0].concat(time[1]);
      }
      result[result.map((i) => i.hour.toString()).indexOf(time)].spend +=
        Number(item.spend);
    });
  }

  for (const j of adAccountId.filter((item) => item.accountType === "tiktok")) {
    spends = await getHourlyTiktokSpend(start, end, j);
    spends.list.forEach((item) => {
      let date = new Date(item.dimensions.stat_time_hour);
      const hour = date.getHours();
      result[
        result.map((i) => i.hour.toString()).indexOf(hour.toString())
      ].spend += Number(item.metrics.spend);
    });
  }

  result = result.map((item) => ({
    ...item,
    id: item.hour,
    key: item.hour,
    profit: item.revenue - item.spend,
    roas: item.revenue / item.spend,
  }));
  return result;
};

export const getHourlyRevenue = (start, end) => {
  const requestBody = {
    rangeFrom: start,
    rangeTo: end,
    breakdowns: "hour,sub_id1",
    breakdown: "hour",
    filters: {
      advertiers: "2",
    },
    columns: "approved_revenue",
  };
  return fetch(
    `${corsProxy}https://track.berrygoodmedia.org/api/v2/network/reports/statistics-tree?api-key=6b3ee83859602c045e3da770d3e645a3614929d4&lang=en&sortField=hour&sortDirection=asc&perPage=1000&page=1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  )
    .then((res) => res.json())
    .then((data) => data.info.rows)
    .catch((err) => {
      console.error(err);
    });
};

export const getHourlyFacebookSpend = async (start, end, adAccount) => {
  const facebookToken = await getTokenByName("FACEBOOK_TOKEN");
  return fetch(
    `${corsProxy}https://graph.facebook.com/v16.0/act_${adAccount.token}/insights?access_token=${facebookToken}&fields=spend&time_range={"since":"${start}","until":"${end}"}&level=account&limit=100&breakdowns=hourly_stats_aggregated_by_advertiser_time_zone`,
    { method: "GET" },
  )
    .then((res) => res.json())
    .then((data) => data.data)
    .catch((err) => {
      console.log(err);
    });
};

export const getHourlyTiktokSpend = (start, end, adAccount) => {
  return fetch(
    `${corsProxy}https://business-api.tiktok.com/open_api/v1.3/report/integrated/get?advertiser_id=${adAccount.token}&page=1&data_level=AUCTION_ADGROUP&report_type=BASIC&dimensions=["adgroup_id","stat_time_hour"]&metrics=["adgroup_name","spend"]&page_size=500&start_date=${end}&end_date=${end}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": adAccount.accessToken,
      },
    },
  )
    .then((res) => res.json())
    .then((data) => data.data)
    .catch((err) => {
      console.log(err);
    });
};
