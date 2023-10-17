import { getSocialApiByName } from "./socials";
import { corsProxy } from "./general";

// Login To Snapchat API and return the Bearer token { access_token }
export const snapChatLogin = async () => {
  var snapchatLoginApi = await getSocialApiByName("SnapChat Login API");
  var snapchatLogin = snapchatLoginApi.value;

  return fetch(`${corsProxy}${snapchatLogin}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        return data.access_token;
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
