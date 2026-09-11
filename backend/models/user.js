const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    icon: {
      type: String,
      default: ""
    }
  },
  {
    _id: true
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      default: null
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    emailVerificationCode: {
      type: String,
      default: null
    },

    emailVerificationExpires: {
      type: Date,
      default: null
    },

    currency: {
      type: String,
      default: "INR"
    },

    categories: {
      type: [categorySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);