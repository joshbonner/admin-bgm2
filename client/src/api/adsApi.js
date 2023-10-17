import dayjs from "dayjs";
import { corsProxy } from "./general";
import { getSocialApiById, getSocialApiByName } from "./socials";
import addNotification from "react-push-notification";
import { getTokenByName } from "./token";

/**
 * @params {startDate, endDate}
 * @return TikTok data with JSON
 */
export const getTiktok_adgroup = async (start, end, account) => {
  /**
   * @method GET
   * @desc Get Tiktok data with JSON type
   */
  const socialApi = await getSocialApiById("64608138a490c18d3a7d66e5");
  var tiktokApi = socialApi.value.replace("${start}", start);
  tiktokApi = tiktokApi.replace("${end}", end);
  tiktokApi = tiktokApi.replace("${account.token}", account.token);
  return fetch(`${corsProxy}${tiktokApi}`, {
    method: "GET",
    headers: {
      "Access-Token": account.accessToken,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.data;
    })
    .catch((err) => {
      addNotification({
        title: "503: Internal Server Error",
        message:
          "Did you uninstall AdBlock extension? You need to disable it now",
        theme: "red",
        duration: 5000,
        native: false,
        closeButton: "X",
      });
    });
};

/**
 * @params {startDate, endDate}
 * @return TikTok data with JSON
 */
export const getTiktok_campaign = async (start, end, account) => {
  const socialApi = await getSocialApiById("6460811aa490c18d3a7d66e3");
  var tiktokApi = socialApi.value.replace("${start}", start);
  tiktokApi = tiktokApi.replace("${end}", end);
  tiktokApi = tiktokApi.replace("${account.token}", account.token);

  /**
   * @method GET
   * @desc Get Tiktok data with JSON type
   */
  return fetch(`${corsProxy}${tiktokApi}`, {
    method: "GET",
    headers: {
      "Access-Token": account.accessToken,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.data;
    })
    .catch((err) => {
      addNotification({
        title: "503: Internal Server Error",
        message:
          "Did you uninstall AdBlock extension? please check and try again",
        theme: "red",
        duration: 5000,
        native: false,
        closeButton: "X",
      });
    });
};

export const getSnapchatAds = async (start, end, account, breakdown) => {
  // Params
  const start_time = `${start}T00:00:00-04:00`;
  const end_time = `${dayjs(start)
    .add(1, "day")
    .format("YYYY-MM-DD")}T00:00:00-04:00`;

  var socialApi = await getSocialApiById("6460805fa490c18d3a7d66dd");
  var snapchatLogin = socialApi.value;
  socialApi = await getSocialApiByName("SnapChat API");
  var snapchatApi = socialApi.value.replace("${start_time}", start_time);
  snapchatApi = snapchatApi.replace("${end_time}", end_time);
  snapchatApi = snapchatApi.replace("${breakdown}", breakdown);
  snapchatApi = snapchatApi.replace("${account}", account);

  return fetch(`${corsProxy}${snapchatLogin}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      // Params
      return fetch(`${corsProxy}${snapchatApi}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${data.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch(async (err) => {
          addNotification({
            title: "503: Internal Server Error",
            message: "Please check your server status",
            theme: "red",
            duration: 5000,
            native: false,
            closeButton: "X",
          });
        });
    })
    .catch((err) => {
      addNotification({
        title: "503: Snapchat Login Error",
        message: "Please check your Login API",
        theme: "red",
        duration: 5000,
        native: false,
        closeButton: "X",
      });
    });
};

// Facebook API Pulling
export const getFacebookAds = async (start, end, ad_account) => {
  const socialApi = await getSocialApiByName("Facebook API");
  const facebookToken = await getTokenByName("FACEBOOK_TOKEN");
  let facebookApi = socialApi.value.replace("${start}", start);
  facebookApi = facebookApi.replace("${end}", end);
  facebookApi = facebookApi.replace("${ad_account}", ad_account);
  facebookApi = facebookApi.replace("${access_token}", facebookToken);

  return fetch(`${facebookApi}`)
    .then((res) => res.json())
    .then((data) => {
      const batches = data.data.map((item) => ({
        method: "GET",
        relative_url: `v17.0/${item.adset_id}/?fields=daily_budget`,
      }));
      if (batches.length < 50) {
        return fetch(
          `${corsProxy}https://graph.facebook.com/?access_token=${facebookToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              batch: batches,
            }),
          },
        )
          .then((r) => r.json())
          .then((d) => {
            const results = data.data.map((item, i) => ({
              ...item,
              daily_budget: JSON.parse(d[i].body).daily_budget,
            }));

            return { data: results };
          });
      } else if (batches.length >= 50) {
        let batchChunks = [];
        while (batches.length) {
          batchChunks.push(batches.splice(0, 50));
        }
        let result = [];
        for (const chunk of batchChunks) {
          return fetch(
            `${corsProxy}https://graph.facebook.com/?access_token=${facebookToken}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                batch: chunk,
              }),
            },
          )
            .then((r) => r.json())
            .then((d) => {
              const results = data.data.map((item, i) => ({
                ...item,
                daily_budget: JSON.parse(d[i].body).daily_budget,
              }));
              result.push(results);
            });
        }
        return { data: result };
      }
    });
};
