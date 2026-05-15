import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { username } = await params;
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User GET error:", error);
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
    const { username } = await params;
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user._id.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates = await request.json();
    const allowedFields = ["name", "bio", "skills", "githubUrl", "linkedinUrl", "portfolioUrl", "avatar", "banner", "githubUsername", "location", "experienceLevel", "availabilityStatus", "favoriteFramework"];

    const filteredUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, filteredUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("User PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
