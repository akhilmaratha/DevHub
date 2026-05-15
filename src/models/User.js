import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
    avatar: { type: String, default: "" },
    banner: { type: String, default: "" },

    // Profile enhancements
    githubUsername: { type: String, default: "" },
    location: { type: String, default: "" },
    experienceLevel: {
      type: String,
      enum: ["", "junior", "mid", "senior", "lead", "staff"],
      default: "",
    },
    availabilityStatus: {
      type: String,
      enum: ["", "available", "busy", "open-to-collaborate", "hiring"],
      default: "",
    },
    favoriteFramework: { type: String, default: "" },
    featuredProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    // Social
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarkedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    bookmarkedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
