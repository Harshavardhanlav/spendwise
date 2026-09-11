const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300
    }
  },
  { timestamps: true }
);

budgetSchema.path("endDate").validate(function (value) {
  if (!this.startDate || !value) return true;
  return value >= this.startDate;
}, "End date must not be before start date");

budgetSchema.index({ userId: 1, startDate: 1, endDate: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
