import { Request, Response } from "express";
import SocialAPIModel from "../models/SocialAPI";

export const getAPI = (req: Request, res: Response) => {
  SocialAPIModel.find().then((item) => res.json(item));
};

export const getApiById = (req: Request, res: Response) => {
  SocialAPIModel.findById(req.params._id).then((item) => res.json(item));
};

export const getApiByName = (req: Request, res: Response) => {
  SocialAPIModel.findOne({ name: req.params._name }).then((item) =>
    res.json(item),
  );
};

export const addAPI = (req: Request, res: Response) => {
  new SocialAPIModel({ name: req.body.name, value: req.body.value })
    .save()
    .then((item) => res.json(item));
};

export const editAPI = (req: Request, res: Response) => {
  SocialAPIModel.findByIdAndUpdate(
    req.params._id,
    { $set: req.body },
    { new: true },
  ).then((item) => res.json(item));
};
