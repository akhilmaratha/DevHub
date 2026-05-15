import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Activity from "@/models/Activity";
import { getServerSession } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isLiked = project.likes.includes(session.userId);

    if (isLiked) {
      await Project.findByIdAndUpdate(id, { $pull: { likes: session.userId } });
    } else {
      await Project.findByIdAndUpdate(id, { $addToSet: { likes: session.userId } });
      if (project.userId.toString() !== session.userId) {
        await Activity.create({
          type: "like_project",
          userId: session.userId,
          projectId: id,
        });
      }
    }

    const updated = await Project.findById(id).select("likes");
    return NextResponse.json({
      liked: !isLiked,
      likesCount: updated.likes.length,
    });
  } catch (error) {
    console.error("Like project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
