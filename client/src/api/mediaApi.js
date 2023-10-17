import isEmpty from "is-empty";
import dayjs from "dayjs";
import { notificationError, requestErrType, corsProxy } from "./general";
import { getSocialApiById, getSocialApiByName } from "./socials";
import { getTokenByName } from "./token";

// Get Affiliate Dash Data
export const getAffiliate = async (start, end) => {
  // set request erorr
  var requestError = requestErrType;
  requestError = {
    ...requestError,
    status: 200,
    title: "Affiliate API Request",
  };

  const socialApi = await getSocialApiByName("BGM Affiliate API");
  var apiValue = socialApi.value;
  apiValue = apiValue.replace("${start}", start);
  apiValue = apiValue.replace("${end}", end);

  // Get Data from BGM Affiliate
  return fetch(`${corsProxy}${apiValue}`)
    .then((res) => res.json())
    .then((data) => {
      return data.info.rows.rows.map((item) => ({
        name: item.sub_id1.value,
        revenue: item.approved_payout,
      }));
    });
};

// Get Infuse API Data
export const getInfuse = async (start, end) => {
  // set request error
  var requestError = requestErrType;
  requestError = {
    ...requestError,
    status: 200,
    title: "Infuse API Request Error!",
  };

  // const socialApi = await getSocialApiById("646079c2a490c18d3a7d66cf");
  const socialApi = await getSocialApiByName("Infuse API");
  const infuseApiKey = await getTokenByName("INFUSE_API_KEY");
  var apiValue = socialApi.value;
  apiValue = apiValue.replace("${start}", start);
  apiValue = apiValue.replace("${end}", end);
  apiValue = apiValue.replace("${insue_api_key}", infuseApiKey);

  // Get Data from Infuse API
  return fetch(`${corsProxy}${apiValue}`)
    .then((res) => {
      if (!res.ok) {
        // case of response status is not 200
        requestError = {
          ...requestError,
          status: res.status,
          subtitle: `${res.status} ${res.statusText}`,
        };
      }
      return res.json();
    })
    .then((data) => {
      if (requestError.status !== 200) {
        notificationError(requestError);
        return [];
      }

      if (!isEmpty(data.response.errorMessage)) {
        // case of response status === 200 && error occurd
        requestError = {
          ...requestError,
          message: data.response.errorMessage,
        };
        notificationError(requestError);
        return [];
      }

      return data.response.data.data;
    });
};

// Get Fluent Data
export const getFluent = async (start, endDate) => {
  // set request error
  var requestError = requestErrType;
  requestError = {
    ...requestError,
    status: 200,
    title: "Fluent API Error!",
  };
  const end = dayjs(endDate).add(1, "day").format("YYYY-MM-DD");
  const socialResponse = await getSocialApiById("64607a0ea490c18d3a7d66d1");
  var fluentApi = socialResponse.value;
  fluentApi = fluentApi.replace("${start}", start);
  fluentApi = fluentApi.replace("${end}", end);

  return fetch(`${corsProxy}${fluentApi}`)
    .then((res) => {
      if (!res.ok) {
        // case of response status is not 200
        requestError = {
          ...requestError,
          status: res.status,
          subtitle: `${res.status} ${res.statusText}`,
          message: "",
        };
      }
      return res.json();
    })
    .then((data) => {
      if (requestError.status !== 200) {
        requestError.message = data.message;
        notificationError(requestError);
        return [];
      }
      if (isEmpty(data.data)) return [];
      return data.data;
    });
};

// Get Tapp Data
export const getTapp = async (start, end) => {
  // set request error
  var requestError = requestErrType;
  requestError = {
    ...requestError,
    status: 200,
    title: "TApp API Error!",
  };

  const socialApi = await getSocialApiById("64607a61a490c18d3a7d66d3");
  var tappApi = socialApi.value;
  tappApi = tappApi.replace("${start}", start);
  tappApi = tappApi.replace("${end}", end);

  return fetch(`${corsProxy}${tappApi}`)
    .then((res) => {
      if (!res.ok) {
        // case of response status is not 200
        requestError = {
          ...requestError,
          status: res.status,
          subtitle: `${res.status} ${res.statusText}`,
          message: "",
        };
      }
      return res.json();
    })
    .then((tapp) => {
      if (!isEmpty(tapp.response.errorMessage)) {
        // case of response status === 200 && error occurd
        requestError = {
          ...requestError,
          message: tapp.response.errorMessage,
        };
        notificationError(requestError);
        return [];
      }
      return [...tapp.response.data.data];
    });
};

/**
 * @params {startDate, endDate}
 * @return JSON Plug data
 */
export const getPlug = async (
  start,
  end,
  bearerToken,
  timezone = "New_York",
) => {
  // set request error
  var requestError = requestErrType;
  requestError = {
    ...requestError,
    status: 200,
    title: "Plug API Error!",
  };

  var socialApi = await getSocialApiById("64607ab3a490c18d3a7d66d5");
  var googleApis = socialApi.value;
  socialApi = await getSocialApiById("64607b2da490c18d3a7d66d9");
  var herokuApi = socialApi.value.replace("${start}", start);
  herokuApi = herokuApi.replace("${end}", end);
  herokuApi = herokuApi.replace("${timezone}", timezone);
  const plugRefreshToken = await getTokenByName("PLUG_REFRESH_TOKEN");

  return fetch(
    // `https://securetoken.googleapis.com/v1/token?key=AIzaSyCRYBeb5B5J0EJQr7-631BTwu4f6p9EsKc`,
    `${googleApis}`,
    {
      method: "POST",
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: plugRefreshToken,
      }),
    },
  )
    .then((res) => res.json())
    .then((data) => {
      const idToken = data.id_token;
      /**
       * @method GET
       * @desc Get Plug data by Firebase token with JSON type
       */
      return fetch(`${corsProxy}${herokuApi}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: bearerToken,
          FirebaseToken: idToken,
        },
      })
        .then((res) => {
          if (!res.ok) {
            // case of response status is not 200
            requestError = {
              ...requestError,
              status: res.status,
              subtitle: `${res.status} ${res.statusText}`,
              message: "",
            };
          }
          return res.json();
        })
        .then((data) => {
          var result = [];
          const plugData = data;
          if (!isEmpty(plugData)) {
            plugData.data.forEach((item) => {
              const matched = result.filter(
                (i) => i.media_name === item.media_name,
              );
              if (matched.length === 0) {
                result.push({
                  campaign_image_url: item.campaign_image_url,
                  campaign_name: item.campaign_name,
                  media_name: item.media_name,
                  dollars: item.dollars,
                });
              } else {
                result[
                  result.map((i) => i.media_name).indexOf(item.media_name)
                ].dollars += item.dollars;
              }
            });
          }
          return result;
        });
    });
};

export const getAragonAndPanelXyz = (start, end, apiCat) => {
  const aragonApiKey = "lTICGFDRnyII94Z1Q0niQ";
  const panelXyzApiKey = "aphNMal5QOnvdPJq7ctA";
  return fetch("https://api.eflow.team/v1/affiliates/reporting/entity/table", {
    body: JSON.stringify({
      from: start,
      to: end,
      timezone_id: 80,
      currency_id: "USD",
      columns: [
        {
          column: "sub1",
        },
      ],
      query: {
        filters: [],
      },
    }),
    method: "POST",
    headers: {
      "X-Eflow-API-Key": apiCat === "aragon" ? aragonApiKey : panelXyzApiKey,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const result = data.table.map((item) => ({
        id: item.columns[0].id,
        revenue: item.reporting.revenue,
      }));
      return result;
    });
};
