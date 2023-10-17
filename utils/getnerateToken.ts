import jwt from "jsonwebtoken";

const generateToken = (user: any) => {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
};

export default generateToken;
