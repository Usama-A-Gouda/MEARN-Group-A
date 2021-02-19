const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { registerValidation, loginValidation } = require("../validation");
exports.createUser = async (req, res, next) => {
  // req.body => {username : '' , password : ""}
  try {
    console.log(req.body);
    const { username, email, password, confirmedPassword } = req.body;

    const errors = registerValidation({
      username,
      email,
      password,
      confirmedPassword,
    }).error;

    if (errors) {
      const error = new Error(errors.details[0].message);
      error.statusCode = 422;
      throw error;
    }
    // const { username, email, confirmedPassword } = req.body;
    // const password = req.body.password;
    let image;
    if (req.file) {
      image = req.file.path;
    } else {
      image = "images/avatar7.png";
    }
    //  checking for email existing
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      const error = new Error("Email is existed , Please Pick Another Email");
      error.statusCode = 401;
      throw error;
    }
    if (password != confirmedPassword) {
      const error = new Error();
      error.statusCode = 401;
      error.message = "Password Doesn't Match, Please Try Again ";
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      imageURL: image,
    });

    const newUser = await user.save();
    return res.status(201).json({
      Data: newUser,
      Message: "User Created Successfully",
      Error: null,
      Success: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
  //   await user.save();
};
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("from login", req.body);
  const errors = loginValidation({ email, password }).error;

  if (errors) {
    const error = new Error(errors.details[0].message);
    error.statusCode = 422;
    return next(error);
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    const error = new Error();
    error.statusCode = 401;
    error.message = "Email OR Passwrod Is Not Correct.";
    return next(error);
  }
  // const isEqual = await bcrypt.compare(password, foundUser.password);
  // if (!isEqual) {
  //   const error = new Error();
  //   error.statusCode = 401;
  //   error.message = "Email OR Passwrod Is Not Correct.";
  //   return next(error);
  // }
  try {
    const token = jwt.sign(
      {
        username: foundUser.username,
        userID: foundUser._id,
      },
      "nanananaHabibaIsBananaaaa"
      // { expiresIn: "2h" }
    );
    let userID = foundUser._id;
    res.status(200).json({
      Data: { token, userID },
      Message: `Welcome ${foundUser.username} , You Logged In Succcefully`,
      Error: null,
      Success: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

exports.getUser = async (req, res, next) => {
  console.log(req.params);
  const admin = await Admin.findById("6027109bb911cc1e1c5d0540");

  const { userId } = req.params;
  const foundUser = await User.findById(userId)
    .populate({
      path: "posts",
      model: "Post",
      populate: {
        path: "comments",
        model: "Comment",
        populate: { path: "author", model: "User" },
      },
    })
    .populate({
      path: "comments",
      model: "Comment",
    })
    .populate({
      path: "favoritePosts",
      model: "Post",
      populate: [
        {
          path: "author",
          model: "User",
        },
        {
          path: "comments",
          model: "Comment",
          populate: { path: "author", model: "User" },
        },
      ],
    });
  console.log(foundUser);
  if (!foundUser) {
    const error = new Error();
    error.statusCode = 401;
    error.message = "No User With This ID";
    return next(error);
  }

  res.status(200).json({
    Data: foundUser,
    Message: `This User Is Found Succcefully`,
    Error: null,
    Success: true,
  });
};

exports.editUser = async (req, res, next) => {
  // req.body => {username : '' , password : ""}
  const admin = await Admin.findById("6027109bb911cc1e1c5d0540");

  let { username, email, password, confirmedPassword } = req.body;
  let { userId } = req.params;
  try {
    if (admin) {
      const foundUser = await User.findById(userId);
      foundUser.username = username;
      foundUser.email = email;
      foundUser.password = foundUser.password;

      if (req.file) {
        foundUser.imageURL = req.file.path;
      } else {
        foundUser.imageURL = foundUser.imageURL;
      }

      await foundUser.save();
      return res.status(201).json({
        Data: foundUser,
        Message: "User Updated Successfully",
        Error: null,
        Success: true,
      });
    }

    const errors = registerValidation({
      username,
      email,
      password,
      confirmedPassword,
    }).error;

    if (errors) {
      const error = new Error(errors.details[0].message);
      error.statusCode = 422;
      throw error;
    }

    let image;
    if (req.file) {
      image = req.file.path;
    } else {
      image = "images/avatar7.png";
    }

    const foundUser = await User.findById(userId);

    if (foundUser._id.toString() != req.userID.toString() && !admin) {
      const error = new Error();
      error.statusCode = 403;
      error.message = "Error , You Can't Edit This User";
      return next(error);
    }
    if (password != confirmedPassword) {
      const error = new Error();
      error.statusCode = 401;
      error.message = "Password Doesn't Match, Please Try Again ";
      throw error;
    }
    if (!foundUser || foundUser.length == 0) {
      const error = new Error("No User Is Founded With This ID!");
      error.statusCode = 422;
      throw error;
    }
    let hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username,
        password: hashedPassword,
        email: email,
        imageURL: image,
      },
      {
        new: true,
      }
    );
    return res.status(201).json({
      Data: updatedUser,
      Message: "User Updated Successfully",
      Error: null,
      Success: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
  //   await user.save();
};
exports.getUsersByUsername = async (req, res, next) => {
  const { username } = req.params;
  const foundUser = await User.find({
    username: { $regex: username, $options: "i" },
  })
    .populate({
      path: "posts",
      model: "Post",
      populate: {
        path: "comments",
        model: "Comment",
        populate: { path: "author", model: "User" },
      },
    })
    .populate({
      path: "comments",
      model: "Comment",
    });
  console.log(foundUser);
  if (!foundUser) {
    const error = new Error();
    error.statusCode = 401;
    error.message = "No Users With This Username";
    return next(error);
  }
  res.status(200).json({
    Data: foundUser,
    Message: `This User Is Found Succcefully`,
    Error: null,
    Success: true,
  });
};
exports.deleteUser = async (req, res, next) => {
  // req.body => {username : '' , password : ""}
  const { userId } = req.params;
  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      const error = new Error("No user with this id");
      error.statusCode = 401;
      throw error;
    }
    const admin = await Admin.findById("6027109bb911cc1e1c5d0540");
    if (foundUser._id.toString() != req.userID.toString() && !admin) {
      const error = new Error();
      error.statusCode = 403;
      error.message = "Error , You Can't Delete This User";
      next(error);
    }
    await Post.deleteMany({ _id: { $in: foundUser.posts } });
    await Comment.deleteMany({ _id: { $in: foundUser.comments } });
    const deletedUser = await User.findByIdAndDelete(userId);

    return res.status(200).json({
      Data: deletedUser,
      Message: "User Deleted Successfully",
      Error: null,
      Success: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
  //   await user.save();
};

exports.getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "posts",
        model: "Post",
        populate: {
          path: "comments",
          model: "Comment",
          populate: { path: "author", model: "User" },
        },
      })
      .populate({
        path: "comments",
        model: "Comment",
      })
      .populate({
        path: "favoritePosts",
        model: "Post",
        populate: [
          {
            path: "author",
            model: "User",
          },
          {
            path: "comments",
            model: "Comment",
            populate: { path: "author", model: "User" },
          },
        ],
      });

    if (!allUsers) {
      const error = new Error();
      error.statusCode = 401;
      error.message = "No Users Are Founded";
      throw error;
    }
    res.status(200).json({
      Data: allUsers,
      Message: "Users Are Found Successfully",
      Success: true,
      Error: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
