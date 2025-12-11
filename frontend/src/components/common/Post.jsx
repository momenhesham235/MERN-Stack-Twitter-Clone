import { FaEdit, FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import useGetMe from "../../hooks/auth/useGetMe";
import { formatPostDate } from "../../utils/date";
import useDeletePost from "../../hooks/posts/useDeletePost";
import LoadingSpinner from "./LoadingSpinner";
import useLikeOrUnLikePost from "../../hooks/posts/useLikeOrUnlikePost";
import useCreateComment from "../../hooks/comments/useCreateComment";
import useDeleteComment from "../../hooks/comments/useDeleteComment";
import { useUpdateComment } from "../../hooks/comments/useUpdateComment";

const Post = ({ post = {} }) => {
  const { data: authUser } = useGetMe();
  const { mutate: deletePostMutate, isPending: isDeleting } = useDeletePost();
  const { mutate: likePostMutate, isPending: isLiking } = useLikeOrUnLikePost();

  const isLiked = post.likes?.includes(authUser?.data?._id);

  const isMyPost = authUser?.data?._id === post.user?._id;
  const postOwner = post.user || {};

  const formattedDate = formatPostDate(post.createdAt);

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostMutate(post._id);
    }
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePostMutate({ postId: post._id });
  };

  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const { mutate: createCommentMutate, isLoading: isCreating } =
    useCreateComment();
  const { mutate: deleteCommentMutate } = useDeleteComment();
  const { mutate: updateComment } = useUpdateComment(post._id);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createCommentMutate({ content: comment, postid: post._id });
    setComment("");
  };

  const handleEditComment = (comment, content) => {
    updateComment({
      commentId: comment._id,
      updatedContent: content,
    });
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    deleteCommentMutate(commentId);
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img
              src={
                postOwner.profileImg ||
                "src/assets/images/avatar-placeholder.png"
              }
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullname}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}

                {isDeleting && <LoadingSpinner size="sm" />}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.content}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post._id)
                    .showModal()
                }
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>

                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments?.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}

                    {post.comments?.map((c) => (
                      <div key={c._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full overflow-hidden">
                            <img
                              src={
                                c.userid?.profileImg ||
                                "src/assets/images/avatar-placeholder.png"
                              }
                              alt=""
                            />
                          </div>
                        </div>

                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold">
                              {c.userid?.fullname}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{c.userid?.username}
                            </span>

                            {authUser?.data?._id === c.userid?._id && (
                              <div className="flex gap-2">
                                <FaTrash
                                  className="cursor-pointer text-red-500"
                                  onClick={() => handleDeleteComment(c._id)}
                                />
                                <FaEdit
                                  className="cursor-pointer text-sky-400"
                                  onClick={() => {
                                    setEditingCommentId(c._id);
                                    setEditValue(c.content); // مهم: تعبي النص الحالي في حقل الإدخال
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Edit comment */}
                          {editingCommentId === c._id ? (
                            <div className="flex gap-2 mt-1">
                              <input
                                className="input input-bordered w-full"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                              />
                              <button
                                type="button" // مهم: type button لتجنب form submit
                                className="btn btn-sm btn-primary"
                                onClick={() => {
                                  handleEditComment(c, editValue);
                                  setEditingCommentId(null); // خروج من وضع التعديل
                                  setEditValue(""); // مسح الحقل
                                }}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-ghost"
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditValue("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="text-sm">{c.content}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handleAddComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary rounded-full btn-sm text-white px-4"
                      disabled={isCreating}
                    >
                      {isCreating ? "Posting..." : "Post"}
                    </button>
                  </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>

              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isLiking && <LoadingSpinner size="sm" />}
                {!isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
                )}

                <span
                  className={`text-sm  group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : "text-slate-500"
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
