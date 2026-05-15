import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id).populate("userId", "name username avatar bio");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
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

    if (project.userId.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates = await request.json();
    const updatedProject = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("userId", "name username avatar");

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Project PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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

    if (project.userId.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
