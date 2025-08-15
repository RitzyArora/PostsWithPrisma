import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// READ SINGLE
export async function GET(_req: Request, context: { params: Promise<{id:string}> }) {
  const{id}=await context.params
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
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
export async function PUT(req: Request, context: { params: Promise<{id:string}> }) {
const{id}=await context.params
  try {
    const body = await req.json();
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
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
export async function DELETE(_req: Request, context: { params: Promise<{id:string}> }) {
  const{id}=await context.params
  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
