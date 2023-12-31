import api from "../utils/api";

export const login = (user) => {
  return api
    .post("/auth/login", user)
    .then((res) => res.data)
    .catch((err) => {
      return err;
    });
};

export const loadUser = () => {
  return api
    .get("/auth")
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      window.localStorage.clear();
      window.location.href = "/login";
    });
};
