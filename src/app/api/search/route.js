import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import Blog from "@/models/Blog";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    if (!q) {
      return NextResponse.json({ users: [], projects: [], blogs: [] });
    }

    const results = {};

    if (type === "all" || type === "users") {
      results.users = await User.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { username: { $regex: q, $options: "i" } },
          { skills: { $in: [new RegExp(q, "i")] } },
        ],
      })
        .select("-password")
        .limit(10);
    }

    if (type === "all" || type === "projects") {
      results.projects = await Project.find({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { techStack: { $in: [new RegExp(q, "i")] } },
        ],
      })
        .populate("userId", "name username avatar")
        .limit(10);
    }

    if (type === "all" || type === "blogs") {
      results.blogs = await Blog.find({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { tags: { $in: [new RegExp(q, "i")] } },
        ],
      })
        .populate("userId", "name username avatar")
        .limit(10);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
