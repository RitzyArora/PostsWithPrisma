import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content || null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// READ ALL
export async function GET() {
  try {
    const posts = await prisma.post.findMany();
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
