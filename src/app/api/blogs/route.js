import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import Activity from "@/models/Activity";
import { getServerSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const userId = searchParams.get("userId");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (tag) {
      query.tags = { $in: [new RegExp(tag, "i")] };
    }

    if (userId) {
      query.userId = userId;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "popular") sortOption = { likes: -1, createdAt: -1 };

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate("userId", "name username avatar")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(query),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error("Blogs GET error:", error);
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

    let slug = slugify(body.title);
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await Blog.create({
      ...body,
      slug,
      excerpt: body.excerpt || body.content.substring(0, 200),
      userId: session.userId,
    });

    // Log activity
    await Activity.create({
      type: "blog_created",
      userId: session.userId,
      blogId: blog._id,
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error("Blog POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
