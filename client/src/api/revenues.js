import api from "../utils/api";

export const addRevenue = (revenue) => {
  return api(`/revenue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { revenues: revenue },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return [];
    });
};

export const getRevenues = () => {
  return api
    .get(`/revenue`)
    .then((res) => res.data)
    .catch((err) => {
      return [];
    });
};

export const deleteRevenue = (key) => {
  return api.delete(`revenue/${key}`).then((res) => res.data);
};
