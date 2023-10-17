export const formatDate = (d) => {
  const date = new Date(d);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month.toString().length === 1 ? "0" + month : month}/${
    day.toString().length === 1 ? "0" + day : day
  }/${year}`;
};

export const validateDateRangeFormat = (d) => {
  const dateParts = d.split(" - ");
  const startDate = new Date(dateParts[0]);
  const endDate = new Date(dateParts[1]);

  return !isNaN(startDate) && !isNaN(endDate) && endDate.getMonth() < 12;
};
