import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const skill = searchParams.get("skill") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ];
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, "i")] };
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
