import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// READ SINGLE
export async function GET(_req: Request, { params }: { params: Record<string,string> }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(params.id) },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// UPDATE
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updatedPost = await prisma.post.update({
      where: { id: Number(params.id) },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return NextResponse.json(updatedPost);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.post.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
