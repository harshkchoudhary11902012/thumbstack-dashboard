import mongoose from "mongoose";

const statuses = ["wantToRead", "reading", "completed"] as const;
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: statuses, default: "wantToRead" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
export const Book = mongoose.model("Book", bookSchema);
