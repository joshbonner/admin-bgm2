import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User, { IUserRequest } from "../models/User";
import generateToken from "../utils/getnerateToken";

// @Desc Update profile
// @Route /api/users/update
// @Method PUT
export const updateProfile = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    let user = await User.findById(req.user.id);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    const { name, email, avatar } = req.body;

    user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        avatar,
      },
      { new: true },
    ).select("-password");

    res.status(201).json({
      id: user?._id,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      isAdmin: user?.isAdmin,
      token: generateToken(user?._id),
    });
  },
);

// @Desc Update password
// @Route /api/users/password/:_id
// @Method PUT
export const resetPassword = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    const user = await User.findById(req.params._id);
    const newPassword = "123456789";

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    User.findByIdAndUpdate(
      req.user.id,
      {
        password: hash,
      },
      { new: true },
    ).then((news) => res.json(news));
  },
);

// @Desc Update password
// @Route /api/users/update/password
// @Method PUT
export const updatePassword = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    let user = await User.findById(req.user.id);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    const { oldPassword, newPassword } = req.body;

    if (await user.comparePassword(oldPassword)) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);

      user = await User.findByIdAndUpdate(
        req.user.id,
        {
          password: hash,
        },
        { new: true },
      );

      res.status(201).json({
        id: user?._id,
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
        isAdmin: user?.isAdmin,
        token: generateToken(user?._id),
      });
    } else {
      res.status(401);
      throw new Error("Old password incorrect");
    }
  },
);

// @Desc Get all users
// @Route /api/users
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User.countDocuments();
  const users = await User.find({})
    .select("-password")
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.status(201).json({
    users,
    page,
    pages: Math.ceil(count / pageSize),
    count,
  });
});

// @Desc Get single user by ID
// @Route /api/users/:id
// @Method GET
export const getSingleUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    res.status(201).json(user);
  },
);

// @Desc Update user by ID
// @Route /api/users/:id
// @Method PUT
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password");

  res.status(201).json(user);
});

// @Desc Delete user by ID
// @Route /api/users/:id
// @Method DELETE
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(201).json({});
});
