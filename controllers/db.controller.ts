import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

/**
 * @desc Get All Collection names
 */
export const getAllCollections = asyncHandler(
  async (req: Request, res: Response) => {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    res.json(collections);
  },
);

/**
 * @desc Get One Collection data
 */
export const getCollectionData = asyncHandler(
  async (req: Request, res: Response) => {
    const collection = mongoose.connection.collection(req.params._collection);

    const data = await collection.find({}).toArray();
    res.json(data);
  },
);
