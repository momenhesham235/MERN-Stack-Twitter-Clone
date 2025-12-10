import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// postSchema.pre("findOneAndDelete", async function (next) {
//   const postId = this.getQuery()["_id"];
//   await Comment.deleteMany({ postid: postId });
//   next();
// });


// Virtual populate for comments
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postid",
  localField: "_id",
});



const Post = mongoose.model("Post", postSchema);

export default Post;
