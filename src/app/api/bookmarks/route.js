import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { type, id } = await request.json();

    if (!type || !id) {
      return NextResponse.json({ error: "type and id are required" }, { status: 400 });
    }

    const field = type === "project" ? "bookmarkedProjects" : "bookmarkedBlogs";
    const user = await User.findById(session.userId);
    const isBookmarked = user[field].includes(id);

    if (isBookmarked) {
      await User.findByIdAndUpdate(session.userId, { $pull: { [field]: id } });
    } else {
      await User.findByIdAndUpdate(session.userId, { $addToSet: { [field]: id } });
    }

    return NextResponse.json({ bookmarked: !isBookmarked });
  } catch (error) {
    console.error("Bookmark error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.userId)
      .populate({
        path: "bookmarkedProjects",
        populate: { path: "userId", select: "name username avatar" },
      })
      .populate({
        path: "bookmarkedBlogs",
        populate: { path: "userId", select: "name username avatar" },
      })
      .select("bookmarkedProjects bookmarkedBlogs");

    return NextResponse.json({
      projects: user?.bookmarkedProjects || [],
      blogs: user?.bookmarkedBlogs || [],
    });
  } catch (error) {
    console.error("Bookmarks GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
