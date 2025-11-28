import asyncHandler from "express-async-handler";
import STATUS from "../utils/http.status.text.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import {
  validateCreateComment,
  validateUpdateComment,
} from "../utils/validations/comment.validation.js";

/** * @desc   Create a new comment
 * @route  /comments/
 * @method POST
 * @access Protected
 */
export const createComment = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: STATUS.FAILURE, message: error.details[0].message });
  }

  const { content } = req.body;
  const userId = req.user._id.toString();
  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json({ status: STATUS.FAILURE, message: "User not found" });
  }
  const newComment = Comment({
    postid: req.body.postid,
    userid: req.user._id,
    content: content,
    username: user.username,
  });
  await newComment.save();

  // send response
  res.status(200).json({
    status: STATUS.SUCCESS,
    message: "Comment created successfully",
    data: newComment,
  });
});

/** * @desc   Delete a comment
 * @route  /comments/:id
 * @method DELETE
 * @access Protected
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res
      .status(404)
      .json({ status: STATUS.FAILURE, message: "Comment not found" });
  }
  if (comment.userid.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      status: STATUS.FAILURE,
      message: "You are not authorized to delete this comment",
    });
  }
  await Comment.findByIdAndDelete(commentId);
  res
    .status(200)
    .json({ status: STATUS.SUCCESS, message: "Comment deleted successfully" });
});

/** * @desc   Update a comment
 * @route  /comments/:id
 * @method PATCH
 * @access Protected
 */
export const updateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const { error } = validateUpdateComment(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: STATUS.FAILURE, message: error.details[0].message });
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res
      .status(404)
      .json({ status: STATUS.FAILURE, message: "Comment not found" });
  }
  if (comment.userid.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      status: STATUS.FAILURE,
      message: "You are not authorized to update this comment",
    });
  }
  const { content } = req.body;
  comment.content = content;
  await comment.save();
  res
    .status(200)
    .json({ status: STATUS.SUCCESS, message: "Comment updated successfully" });
});
