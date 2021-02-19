const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    favoritePosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    favoriteRecipes: [
      {
        type: String,
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    imageURL: {
      type: String,
      default: "https://www.bootdey.com/img/Content/avatar/avatar7.png",
    },
  },
  {
    timestamps: true,
  }
);

// add posts and commnets

module.exports = mongoose.model("User", UserSchema);
