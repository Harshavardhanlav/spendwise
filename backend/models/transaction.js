const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Income or Expense
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    // Date on which transaction happened
    date: {
      type: Date,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Debit Card",
        "Credit Card",
        "Bank Transfer",
        "Net Banking",
        "Other"
      ],
      required: true
    },

    notes: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);