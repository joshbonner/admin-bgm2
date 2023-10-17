import addNotification from "react-push-notification";
import api from "../utils/api";

export const getTokenByName = async (name) => {
  return api
    .get(`/token?name=${name}`)
    .then((res) => {
      if (res.data.token) {
        return res.data.token;
      }
    })
    .catch((err) => {
      addNotification({
        title: "Error",
        subtitle: "There's some error",
        message: err.message,
        theme: "red",
        native: true, // when using native, your OS will handle theming.
      });
    });
};
