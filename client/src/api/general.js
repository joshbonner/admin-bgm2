import addNotification from "react-push-notification";
import isEmpty from "is-empty";

export const requestErrType = {
  status: 200,
  title: "",
  subtitle: "",
  message: "",
};

export const FLOAT_NUM_REGEX = /^[+-]?\d+(\.\d+)?$/;

// cors proxy link
export const corsProxy = "https://berrygoodmedia.herokuapp.com/";

export const infuseFields =
  "Stat.source&fields[]=Stat.payout&fields[]=Stat.clicks";

export const fluentAffiliateId = "206743";

export const tappColumns =
  "date,campaign,campaign_name,campaign_image_url,media,media_name,dollars";

// error notification method
export const notificationError = (err) => {
  addNotification({
    title: !isEmpty(err.title) ? err.title : "",
    subtitle: !isEmpty(err.subtitle) ? err.subtitle : "",
    message: !isEmpty(err.message) ? err.message : "",
    theme: "red",
    duration: 5000,
    native: false,
    closeButton: "X",
  });
};
