import { RequestHandler } from "express";

/**
 * @method POST
 * @param req { query: { id: string, name: string }}}
 * @param res IToken
 * @description Get single token by id or name
 */
export const getToken: RequestHandler = async (req, res) => {
  const { name } = req.query;
  const token = process.env[`SOCIAL_${name}`] as string;
  res.json({ token: token });
};
