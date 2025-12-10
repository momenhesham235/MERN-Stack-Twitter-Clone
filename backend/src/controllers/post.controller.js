import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import asyncHandler from "express-async-handler";
import STATUS from "../utils/http.status.text.js";
import { v2 as cloudinary } from "cloudinary";
import { validateCreatePost } from "../utils/validations/post.validation.js";

/**
 * @desc   Get all posts
 * @route  /posts/
 * @method GET
 * @access Public
 */
export const getAllPosts = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 2;
  const { pageNumber } = req.query;
  let posts;

  if (pageNumber) {
    // pagination
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE) //
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({
        path: "comments",
        populate: { path: "userid", select: "username fullname profileImg" },
      });
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({
        path: "comments",
        populate: { path: "userid", select: "username fullname profileImg" },
      });
  }

  res.status(200).json({
    status: STATUS.SUCCESS,
    message: "Posts fetched successfully",
    data: posts,
  });
});

/**
 * @desc   Get post by id
 * @route  /posts/:id
 * @method GET
 * @access Public
 */
export const getSinglePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id)
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({ path: "comments" });

  if (!post) {
    return res.status(400).json({
      status: STATUS.FAIL,
      message: "Post not found",
      data: null,
    });
  }

  res.status(200).json({
    status: STATUS.SUCCESS,
    message: "Post fetched successfully",
    data: post,
  });
});

/**
 * @desc   Create a new post
 * @route  /posts/create
 * @method POST
 * @access Protected
 */
export const createPost = asyncHandler(async (req, res) => {
  // get user form req.user
  const { content } = req.body;
  let { img } = req.body;

  const { error } = validateCreatePost(req.body);

  if (error) {
    return res
      .status(400)
      .json({ status: STATUS.FAILURE, message: error.details[0].message });
  }

  const userId = req.user._id.toString();

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json({ status: STATUS.FAILURE, message: "User not found" });
  }

  // upload image to cloudinary if img is present
  if (img) {
    try {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json({ status: STATUS.FAILURE, message: "Error uploading image" });
    }
  }

  const newPost = Post({
    user: userId,
    content,
    img,
  });
  await newPost.save();

  res.status(201).json({ status: STATUS.SUCCESS, data: newPost });
});

/**
 * @desc  Delete a post
 * @route  /posts/delete/:id
 * @method DELETE
 * @access Protected
 */
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res
      .status(404)
      .json({ status: STATUS.FAILURE, message: "Post not found" });
  }

  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      status: STATUS.FAILURE,
      message: "You are not authorized to delete this post",
    });
  }

  if (post.img) {
    // extract public_id from img url
    const publicId = post.img.split("/").slice(-1)[0].split(".")[0];

    // delete image from cloudinary
    await cloudinary.uploader.destroy(publicId);
  }

  // delete comments
  await Comment.deleteMany({ postid: post._id });

  await Post.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json({ status: STATUS.SUCCESS, message: "Post deleted successfully" });
});

/**
 * @desc    Like or Unlike a post
 * @route  /posts/like/:id
 * @method  POST
 * @access Protected
 */
export const likeOrUnlikePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id: postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const userLikedPost = post.likes.includes(userId);

  let updatedPost;

  if (userLikedPost) {
    // 🔄 Unlike
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true } // ← يرجع النسخة بعد التحديث
    );

    await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
  } else {
    // ❤️ Like
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } }, // ← يمنع الازدواج لو حصل سباق
      { new: true }
    );

    await User.updateOne(
      { _id: userId },
      { $addToSet: { likedPosts: postId } }
    );

    // إرسال إشعار
    await Notification.create({
      from: userId,
      to: post.user,
      type: "like",
    });
  }

  // 🔥 رجّع النسخة المحدثة من likes فقط
  return res.status(200).json({
    status: STATUS.SUCCESS,
    likes: updatedPost.likes,
    likesCount: updatedPost.likes.length,
  });
});

/**
 * @desc   Get Post Count
 * @route  /posts/count
 * @method GET
 * @access Public
 */
export const getPostCount = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();
  res.status(200).json({ status: STATUS.SUCCESS, data: count });
});

/**
 * @desc   Get Like POST
 * @route  /posts/liked
 * @method GET
 * @access Public
 */
export const getLikedPosts = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user)
    return res
      .status(404)
      .json({ status: STATUS.FAIL, message: "User not found" });

  const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "comments",
      populate: { path: "userid", select: "username fullname profileImg" },
    });
  console.log(likedPosts);

  res.status(200).json({ status: STATUS.SUCCESS, data: likedPosts });
});

/**
 * @desc   Get following POST
 * @route  /posts/following
 * @method GET
 * @access Public
 */
export const getFollowingPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const following = user.following;

  const feedPosts = await Post.find({ user: { $in: following } })
    .sort({ createdAt: -1 })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "comments",
      populate: { path: "userid", select: "username fullname profileImg" },
    });

  res.status(200).json({ status: STATUS.SUCCESS, data: feedPosts });
});

/**
 * @desc   Get User Posts
 * @route  /posts/timeline
 * @method GET
 * @access Public
 */
export const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "comments",
      populate: { path: "userid", select: "username fullname profileImg" },
    });

  console.log(posts);

  res.status(200).json({ status: STATUS.SUCCESS, data: posts });
});
