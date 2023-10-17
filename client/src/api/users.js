import api from "../utils/api";

export const getData = () => {
  return api.get("/user").then((res) => res.data.users);
};

export const addData = (account) => {
  return api.post("/user", account).then((res) => {
    return {
      isValid: true,
      data: res.data,
    };
  });
};

export const editData = (_id) => {
  return api.delete(`/user/${_id}`).then((res) => res.data);
};

export const resetPassword = (_id) => {
  return api.post(`/user/password/${_id}`).then((res) => res.data);
};

export const deleteData = (_id) => {
  return api.delete(`/user/${_id}`).then((res) => res.data);
};
