import axios from "axios";
import { corsProxy } from "./general";
import api from "../utils/api";

export const getFacebookData = (start, campaigns) => {
  return axios
    .get(
      `${corsProxy}https://rewardtasks.com/facebook/fluent?start_date=${start}T00:00:00z&days=7`,
    )
    .then((res) => {
      var jsonText = res.data.replaceAll("<pre>", "");
      jsonText = jsonText.replaceAll("</pre>", ",");
      jsonText = "[" + jsonText.substring(0, jsonText.length - 1) + "]";
      const data = JSON.parse(jsonText);
      var revenueSum;
      return data.map((e) => {
        revenueSum = 0;
        e.data
          // .filter(
          // (item) => campaigns.filter((i) => i === item.sub_id).length !== 0,
          // )
          .forEach((item) => {
            revenueSum += Number(item.revenue);
          });
        console.log(revenueSum);
        revenueSum = revenueSum / e.data.length;
        return revenueSum;
      });
    });
};

export const getTiktokData = (start, end, advertiser_id, accessToken) => {
  return fetch(
    `${corsProxy}https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/?advertiser_id=${advertiser_id}&page=1&data_level=AUCTION_ADGROUP&report_type=BASIC&dimensions=["adgroup_id","stat_time_day"]&metrics=[%22adgroup_name%22,%22spend%22,%22budget%22]&page_size=500&start_date=${start}&end_date=${end}`,
    {
      headers: {
        "Access-Token": accessToken,
      },
    },
  )
    .then((res) => res.json())
    .then((data) => {
      const list = data.data.list;

      console.log(data);
    });
};

export const getRoasData = (start, end, plugAccount, adAccount) => {
  return api
    .get(
      `/roas/?start=${start}&end=${end}&plug_account=${plugAccount}&ad_account=${adAccount}`,
    )
    .then((res) => res.data);
};

export const getRoasMultiData = (start, end, plugAccounts, adAccounts) => {
  return api
    .post(`/roas/multiple?start=${start}&end=${end}`, {
      plugAccounts,
      adAccounts,
    })
    .then((res) => console.log(res));
};

export const insertRoasData = (plugAccount, adAccount, roas) => {
  return api
    .post("/roas", {
      plugAccount: plugAccount,
      adAccount: adAccount,
      roas: roas,
    })
    .then((res) => res.data);
};
