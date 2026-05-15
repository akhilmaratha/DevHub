import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        skills: user.skills,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        portfolioUrl: user.portfolioUrl,
        avatar: user.avatar,
        banner: user.banner,
        followers: user.followers,
        following: user.following,
        githubUsername: user.githubUsername,
        location: user.location,
        experienceLevel: user.experienceLevel,
        availabilityStatus: user.availabilityStatus,
        favoriteFramework: user.favoriteFramework,
        bookmarkedProjects: user.bookmarkedProjects,
        bookmarkedBlogs: user.bookmarkedBlogs,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
