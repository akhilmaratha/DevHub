import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Activity from "@/models/Activity";
import { getServerSession } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { username } = await params;
    const targetUser = await User.findOne({ username });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser._id.toString() === session.userId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const currentUser = await User.findById(session.userId);
    const isFollowing = currentUser.following.some(fid => fid.toString() === targetUser._id.toString());

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(session.userId, { $pull: { following: targetUser._id } });
      await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: session.userId } });
    } else {
      // Follow
      await User.findByIdAndUpdate(session.userId, { $addToSet: { following: targetUser._id } });
      await User.findByIdAndUpdate(targetUser._id, { $addToSet: { followers: session.userId } });

      // Log activity
      await Activity.create({
        type: "follow",
        userId: session.userId,
        targetUserId: targetUser._id,
      });
    }

    const updatedTarget = await User.findById(targetUser._id).select("followers following");
    return NextResponse.json({
      following: !isFollowing,
      followersCount: updatedTarget.followers.length,
    });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
