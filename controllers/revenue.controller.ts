import { RequestHandler } from "express";
import RevenueModel, { IRevenue } from "../models/Revenue";

export const getRevenueList: RequestHandler = (req, res) => {
  RevenueModel.find()
    .select("_id, date")
    .then((list: any) => res.json(list));
};

export const getRevenues: RequestHandler = (req, res) => {
  const { name, offer, campaignId, bearerToken, advertiserId } = req.query;
  const query: any = {};
  if (name) query.name = name;
  if (offer) query.offer = offer;
  if (campaignId) query.campaignId = campaignId;
  if (bearerToken) query.bearerToken = bearerToken;
  if (advertiserId) query.advertiserId = advertiserId;
  RevenueModel.find(query).then((revenues: any) => {
    res.status(200).json(revenues);
  });
};

/**
 * @param req {revenues}
 * @param res
 * @param next
 * @desc Add new Revenue data
 */
export const addRevenue: RequestHandler = (req, res) => {
  // Create new Revenues
  RevenueModel.insertMany(
    req.body.revenues.map((item: IRevenue) => ({
      name: item.name,
      offer: item.offer,
      campaignId: item.campaignId,
      bearerToken: item.bearerToken,
      advertiserId: item.advertiserId,
    })),
  ).then((data: any) => {
    res.status(200).json(data);
  });
};

export const removeRevenue: RequestHandler = (req, res) => {
  RevenueModel.findByIdAndDelete(req.params._id).then((devRev: any) =>
    res.json(devRev._id),
  );
};

export const removeAllRevenue: RequestHandler = async (req, res) => {
  await RevenueModel.deleteMany();
  res.json({ delete: "success" });
};
