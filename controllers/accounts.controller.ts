import { RequestHandler } from "express";
import AccountModel, { IAccounts } from "../models/Accounts";
import accountValidate from "../validations/accountValidate";

/**
 * @param req {*}
 * @param res {Array of Account}
 */
export const getAccounts: RequestHandler = (req, res) => {
  AccountModel.find().then((accounts: Array<IAccounts>) =>
    res.json(accounts.reverse()),
  );
};

/**
 * @param req {accountType, name, token}
 * @param res {IAccount}
 */
export const addAccount: RequestHandler = (req, res) => {
  const { errors, isValid } = accountValidate(req.body);

  if (!isValid) {
    throw res.status(400).json(errors);
  }

  const newAccount: IAccounts = new AccountModel({
    accountType: req.body.accountType,
    name: req.body.name,
    token: req.body.token,
    accessToken: req.body.accessToken,
  });

  newAccount.save().then((account: IAccounts) => res.json(account));
};

/**
 * @param req {params: _id, body: IAccount}
 * @param res {IAccount}
 */
export const editAccount: RequestHandler = (req, res) => {
  AccountModel.findByIdAndUpdate(
    req.params._id,
    { $set: req.body },
    { new: true },
  ).then((item) => res.json(item));
};

/**
 * @param req {params: _id}
 * @param res
 */
export const deleteAccount: RequestHandler = (req, res) => {
  AccountModel.findByIdAndDelete(req.params._id).then((item) => res.json(item));
};

/**
 * @param req
 * @param res
 */
export const deleteManyAccounts: RequestHandler = (req, res) => {
  AccountModel.deleteMany(req.body).then((deletes) => res.json(deletes));
};
