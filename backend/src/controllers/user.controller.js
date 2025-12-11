import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { validateUpdateUser } from "../utils/validations/user.validation.js";
import STATUS from "../utils/http.status.text.js";

/**---------------------------------------
 * @desc    Register User - Sign Up
 * @route    /api/v1/auth/register
 * @method   POST
 ------------------------------------*/
export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select("-password");

  if (!user) {
    return res
      .status(404)
      .json({ status: STATUS.FAIL, message: "User not found" });
  }
  res.status(200).json({ status: STATUS.SUCCESS, data: user });
});

/**---------------------------------------
 * @desc    Follow or Unfollow User
 * @route    /api/v1/user/follow/:id
 * @method   POST
 * ------------------------------------*/
export const followOrUnfollowUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userToModify = await User.findById(id);
  const currentUser = await User.findById(req.user._id);

  // Prevent users from following/un following themselves
  if (id === req.user._id.toString()) {
    return res.status(400).json({
      status: STATUS.FAIL,
      message: "You cannot follow/unfollow yourself",
    });
  }

  if (!userToModify || !currentUser)
    return res
      .status(404)
      .json({ status: STATUS.FAIL, message: "User not found" });

  const isFollowing = currentUser.following.includes(id);

  if (isFollowing) {
    // Unfollow user
    await User.findByIdAndUpdate(
      id,
      { $pull: { followers: currentUser._id } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      currentUser._id,
      { $pull: { following: id } },
      { new: true }
    );

    res.status(200).json({
      status: STATUS.SUCCESS,
      message: `${currentUser.username}  unfollowing you.`,
      code: "unfollowed",
    });
  } else {
    // Follow user
    await User.findByIdAndUpdate(
      id,
      { $push: { followers: currentUser._id } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      currentUser._id,
      { $push: { following: id } },
      { new: true }
    );

    // send follow notification (to be implemented)
    const newNotification = new Notification({
      from: currentUser._id,
      to: userToModify._id,
      type: "follow",
    });
    await newNotification.save();

    // TODO: return the id of the user as a response
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: `${currentUser.username} started following you.`,
      code: "followed",
    });
  }

  await currentUser.save();
  await userToModify.save();
});

/**---------------------------------------
 * @desc     Get Suggested Users
 * @route    /api/v1/user/suggested
 * @method   GET
 * ------------------------------------*/
export const getSuggestedUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get following list of current user
  const user = await User.findById(userId).select("following");
  const followingList = user.following || [];

  // Fetch suggestions directly using MongoDB pipeline (clean + efficient)
  const suggestedUsers = await User.aggregate([
    {
      $match: {
        _id: { $ne: userId }, // exclude current user
      },
    },
    { $sample: { size: 10 } }, // get random 10
    { $project: { password: 0 } }, // remove sensitive fields
  ]);

  // Take first 4 only
  const filteredSuggestions = suggestedUsers.filter(
    (suggestedUser) => !followingList.includes(suggestedUser._id)
  );
  const finalSuggestions = filteredSuggestions.slice(0, 4);

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: finalSuggestions,
  });
});

/**---------------------------------------
 * @desc    Update User Profile
 * @route    /api/v1/user/update
 * @method   PATCH
 * ------------------------------------*/

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);

  if (error) {
    return res
      .status(400)
      .json({ status: STATUS.FAIL, message: error.details[0].message });
  }

  const { username, fullname, email, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  let user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json({ status: STATUS.FAIL, message: "User not found" });
  }

  if (currentPassword) {
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: STATUS.FAIL,
        message: "Current password is incorrect",
      });
    }
  }

  if (profileImg) {
    if (user.profileImg) {
      await cloudinary.uploader.destroy(
        user.profileImg.split("/").pop().split(".")[0]
      );
    }

    const uploadedResponse = await cloudinary.uploader.upload(profileImg);
    profileImg = uploadedResponse.secure_url;
  }

  if (coverImg) {
    if (user.coverImg) {
      await cloudinary.uploader.destroy(
        user.coverImg.split("/").pop().split(".")[0]
      );
    }

    const uploadedResponse = await cloudinary.uploader.upload(coverImg);
    coverImg = uploadedResponse.secure_url;
  }

  // Update fields if provided
  const userUpdate = await User.findByIdAndUpdate(
    userId,
    {
      ...(username && { username }),
      ...(fullname && { fullname }),
      ...(email && { email }),
      ...(newPassword && { password: await bcrypt.hash(newPassword, 10) }),
      ...(bio !== undefined && { bio }),
      ...(link !== undefined && { link }),
      ...(profileImg && { profileImg }),
      ...(coverImg && { coverImg }),
    },
    { new: true, runValidators: true }
  ).select("-password");

  res.status(200).json({
    status: STATUS.SUCCESS,
    message: "Profile updated successfully",
    data: userUpdate,
  });
});
