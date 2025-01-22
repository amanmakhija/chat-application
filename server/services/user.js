const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const CustomError = require("../customError");

exports.registerUser = async (name, email, password) => {
  const hashedPassword = bcrypt.hashSync(password, 12);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("Invalid email or password", 400);
  }
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    throw new CustomError("Invalid email or password", 400);
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return token;
};

exports.updateUser = async (
  authUserId,
  userId,
  name,
  bio,
  file,
  prevAvatar
) => {
  if (authUserId !== userId) {
    throw new CustomError("Action forbidden, you cannot update this user", 403);
  }
  const avatar = (file && file.path) || prevAvatar;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, bio, avatar },
    { new: true }
  ).select("-password");
  if (!updatedUser) {
    throw new CustomError("User not found", 404);
  }
  return updatedUser;
};

exports.deleteUser = async (authUserId, userId) => {
  if (authUserId !== userId) {
    throw new CustomError("Action forbidden, you cannot delete this user", 403);
  }
  const deletedUser = await User.findByIdAndDelete(userId).select("-password");
  if (!deletedUser) {
    throw new CustomError("User not found", 404);
  }
  return deletedUser;
};

exports.searchUser = async (term, authUserId) => {
  if (!term) {
    return [];
  }
  const formattedTerm = term
    .toLowerCase()
    .split("")
    .map((char) =>
      "^!@#$%^&*()-_=+[\\]{};:'\",.<>?/\\|`~".includes(char)
        ? "\\" + char
        : char
    )
    .join("");
  const results = await User.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { name: { $regex: "^" + formattedTerm, $options: "i" } },
              { email: { $regex: "^" + formattedTerm, $options: "i" } },
            ],
          },
          {
            // remove authUser from search results
            _id: { $ne: new mongoose.Types.ObjectId(authUserId) },
          },
        ],
      },
    },
    {
      $unset: "password",
    },
  ]).limit(5);
  return results;
};
