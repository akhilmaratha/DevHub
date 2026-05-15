import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "followers";

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const field = type === "following" ? "following" : "followers";
    const populated = await User.findById(user._id)
      .populate(field, "name username avatar bio skills")
      .select(field);

    return NextResponse.json({ users: populated[field] || [] });
  } catch (error) {
    console.error("Followers GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
