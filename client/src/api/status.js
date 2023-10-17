import { corsProxy } from "./general";
import { getTokenByName } from "./token";

export const getTiktokStatus = (access_token, account_id) => {
  return fetch(
    `${corsProxy}https://business-api.tiktok.com/open_api/v1.3/adgroup/get/?advertiser_id=${account_id}&fields=["operation_status"]&page_size=1000`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": access_token,
      },
    },
  )
    .then((res) => res.json())
    .then((data) => {
      return data.data.list;
    });
};

const getFacebookStatus = async (adset_ids) => {
  var query = "[";
  adset_ids.forEach((item, i) => {
    query += `{method:"GET",name:"adset${
      i + 1
    }",relative_url:"/${item}?fields=status"},`;
  });
  query += "]";
  const facebookToken = await getTokenByName("FACEBOOK_TOKEN");

  return fetch(
    `${corsProxy}https://graph.facebook.com/v17.0/?batch=${query}&access_token=${facebookToken}`,
    {
      method: "POST",
    },
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

export const getFacebookStatusBatch = async (adsetIds) => {
  var j = 0,
    adsetBatch = [],
    statusResult;
  if (adsetIds.length >= 50) {
    for (var i = 0; adsetIds.length > i; i++) {
      adsetBatch.push(adsetIds[i]);
      if (j === 50) {
        statusResult = await getFacebookStatus(adsetBatch);
        adsetBatch = [];
        j = 0;
      }
      j++;
    }
  } else {
    statusResult = await getFacebookStatus(adsetIds);
  }
  return statusResult;
};

export const changeTiktokStatus = (
  access_token,
  advertiser_id,
  adgroup_id,
  status,
) => {
  return fetch(
    `${corsProxy}https://business-api.tiktok.com/open_api/v1.3/adgroup/status/update/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": access_token,
      },
      body: JSON.stringify({
        advertiser_id: advertiser_id,
        adgroup_ids: [adgroup_id],
        operation_status: status ? "ENABLE" : "DISABLE",
      }),
    },
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

export const changeFacebookStatus = async (adset_id, status) => {
  const facebookToken = await getTokenByName("FACEBOOK_TOKEN");
  return fetch(
    `${corsProxy}https://graph.facebook.com/v17.0/${adset_id}/?access_token=${facebookToken}&status=${
      status ? "ACTIVE" : "PAUSED"
    }`,
    {
      method: "POST",
    },
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};
