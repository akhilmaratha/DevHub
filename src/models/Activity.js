import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["follow", "blog_created", "project_created", "like_project", "like_blog", "bookmark"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  {
    timestamps: true,
  }
);

ActivitySchema.index({ createdAt: -1 });
ActivitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
