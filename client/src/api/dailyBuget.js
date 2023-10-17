import addNotification from "react-push-notification";
import { corsProxy } from "./general";
import { snapChatLogin } from "./apiAuth";
import { getSocialApiByName } from "./socials";
import { getTokenByName } from "./token";

export const updateTiktokBudget = ({
  account_token,
  advertiser_id,
  campaignId,
  budget,
}) => {
  return fetch(
    `${corsProxy}https://ads.tiktok.com/open_api/v1.3/adgroup/budget/update/`,
    {
      method: "POST",
      headers: {
        "Access-Token": account_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        advertiser_id: advertiser_id,
        budget: [
          {
            adgroup_id: campaignId,
            budget: budget,
          },
        ],
      }),
    },
  )
    .then((res) => res.json())
    .then((data) => data);
};

export const updateFacebookBudget = async ({ adset_id, budget }) => {
  const facebookToken = await getTokenByName("FACEBOOK_TOKEN");
  return fetch(
    `https://graph.facebook.com/v16.0/${adset_id}?daily_budget=${
      Number(budget) * 100
    }&access_token=${facebookToken}`,
    {
      method: "POST",
    },
  )
    .then((res) => res.json())
    .then((data) => data);
};

export const getSnapchatBudgetAndStatus = async (account_id) => {
  const account_token = await snapChatLogin();
  const socialApi = await getSocialApiByName("Snapchat Budget And Status");
  const url = socialApi.value.replace("${account_id}", account_id);
  return fetch(
    // `https://adsapi.snapchat.com/v1/adaccounts/${account_id}/adsquads`,
    `${corsProxy}${url}`,
    {
      method: "GET",
      headers: {
        Authorization: `bearer ${account_token}`,
      },
    },
  )
    .then((res) => res.json())
    .then((data) => {
      return data.adsquads;
    })
    .catch((err) => {
      addNotification({
        title: "Error",
        subtitle: "Snapchat API",
        message: "There might be error in snapchat api",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
    });
};

export const updateSnapchatBudgetAndStatus = async (
  campaign_id,
  snapchatItem,
  item,
) => {
  console.log(campaign_id, snapchatItem, item);
  const account_token = await snapChatLogin();

  return fetch(
    `${corsProxy}https://adsapi.snapchat.com/v1/campaigns/${campaign_id}/adsquads`,
    {
      method: "PUT",
      headers: {
        Authorization: `bearer ${account_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adsquads: [
          {
            ...snapchatItem,
            status: item.name === "status" ? item.value : snapchatItem.status,
            daily_budget_micro:
              item.name === "budget"
                ? item.value * 1000000
                : snapchatItem.daily_budget_micro,
          },
        ],
      }),
    },
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      addNotification({
        title: "Error",
        subtitle: "Snapchat API",
        message: "There might be error in snapchat api",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
    });
};
