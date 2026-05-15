import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import Activity from "@/models/Activity";
import { getServerSession } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const isLiked = blog.likes.includes(session.userId);

    if (isLiked) {
      await Blog.findByIdAndUpdate(blog._id, { $pull: { likes: session.userId } });
    } else {
      await Blog.findByIdAndUpdate(blog._id, { $addToSet: { likes: session.userId } });
      if (blog.userId.toString() !== session.userId) {
        await Activity.create({
          type: "like_blog",
          userId: session.userId,
          blogId: blog._id,
        });
      }
    }

    const updated = await Blog.findById(blog._id).select("likes");
    return NextResponse.json({
      liked: !isLiked,
      likesCount: updated.likes.length,
    });
  } catch (error) {
    console.error("Like blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
