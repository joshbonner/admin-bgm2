import api from "../utils/api";

export const getSocialApis = () => {
  return api.get("/social").then((res) => res.data);
};

export const getSocialApiById = (_id) => {
  return api.get(`/social/${_id}`).then((res) => res.data);
};

export const getSocialApiByName = (_name) => {
  return api.get(`social/name/${_name}`).then((res) => res.data);
};

export const editSocialApiById = (_id, value) => {
  return api.post(`/social/${_id}`, { value: value }).then((res) => res.data);
};
