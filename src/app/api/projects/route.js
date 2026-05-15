import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Activity from "@/models/Activity";
import { getServerSession } from "@/lib/auth";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const tech = searchParams.get("tech") || "";
    const featured = searchParams.get("featured");
    const userId = searchParams.get("userId");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { techStack: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (tech) {
      query.techStack = { $in: [new RegExp(tech, "i")] };
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (userId) {
      query.userId = userId;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "popular") sortOption = { likes: -1, createdAt: -1 };

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate("userId", "name username avatar")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Project.countDocuments(query),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    const project = await Project.create({
      ...body,
      userId: session.userId,
    });

    // Log activity
    await Activity.create({
      type: "project_created",
      userId: session.userId,
      projectId: project._id,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Project POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
