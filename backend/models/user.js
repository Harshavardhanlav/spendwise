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

    passwordResetCode: {
      type: String,
      default: null
    },

    passwordResetExpires: {
      type: Date,
      default: null
    },

    settingsPasswordResetCodeHash: {
      type: String,
      default: null
    },

    settingsPasswordResetExpires: {
      type: Date,
      default: null
    },

    settingsPasswordResetAuthorizedUntil: {
      type: Date,
      default: null
    },

    settingsPasswordResetLastCodeSentAt: {
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