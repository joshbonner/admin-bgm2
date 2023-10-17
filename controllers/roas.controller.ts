import { RequestHandler } from "express";
import RoasModel, { IRoas } from "../models/Roas";
import isEmpty from "is-empty";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * @method GET
 * @query {date}
 * @desc Get Roas data by selected data
 */
export const getRoas: RequestHandler = (req, res) => {
  const { start, end, ad_account, plug_account } = req.query;
  if (isEmpty(start)) {
    res.status(400).json("date is required");
    return;
  }

  RoasModel.find({
    date: {
      $gte: start,
      $lte: end,
    },
    adAccount: ad_account,
    plugAccount: plug_account,
  }).then((items: IRoas[]) => {
    res.status(200).json(items);
  });
};

/**
 * @method POST
 * @query {date}
 * @params plugAccount, adAccounts
 * @desc Get Roas data by selected data
 */
export const getMultiRoas: RequestHandler = async (req, res) => {
  const { start, end } = req.query;
  const { plugAccounts, adAccounts } = req.body;
  let result: IRoas[] = [];
  try {
    for (const p of plugAccounts) {
      for (const a of adAccounts) {
        const data = await RoasModel.find({
          date: {
            $gte: start,
            $lte: end,
          },
          plugAccount: p,
          adAccount: a,
        });
        result = [...result, ...data];
      }
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(`Multi Data GET ERR :=> ${err}`);
    res.status(500).json(`Multi Data GET ERR :=> ${err}`);
  }
};

/**
 * @method POST
 * @params {roas}
 * @desc Insert the Roas data by Array to Roas JSON
 */
export const insertRoas: RequestHandler = (req, res) => {
  const { roas, adAccount, plugAccount } = req.body;
  if (isEmpty(roas)) {
    res.status(400).json("roas data is requried");
    return;
  }

  interface IRoasRequest extends IRoas {
    isStored: boolean;
  }

  RoasModel.insertMany(
    roas
      .filter((item: IRoasRequest) => !item.isStored)
      .map((item: IRoasRequest) => ({
        adAccount: adAccount,
        plugAccount: plugAccount,
        roas: item.roas,
        date: item.date,
      })),
  )
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => console.error(`ERROR witih Roas storing :=> ${err}`));
};
