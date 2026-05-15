import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Activity from "@/models/Activity";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const userId = searchParams.get("userId");

    const query = userId ? { userId } : {};

    const activities = await Activity.find(query)
      .populate("userId", "name username avatar")
      .populate("targetUserId", "name username avatar")
      .populate("projectId", "title")
      .populate("blogId", "title slug")
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Activity GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
