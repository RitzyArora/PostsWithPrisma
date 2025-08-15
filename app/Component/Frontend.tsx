"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content?: string;
};

export default function Frontend() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN; // This comes from .env

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts", {
        headers: {
          "x-api-key": API_TOKEN || "",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch posts");
        return;
      }
      setPosts(data);
      setError(null);
    } catch {
      setError("Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add or update post
  const savePost = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/posts/${editingId}` : "/api/posts";
      const body = editingId
        ? { title, content }
        : { title, content };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_TOKEN || "",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save post");
        return;
      }

      if (editingId) {
        setPosts(posts.map((p) => (p.id === editingId ? data : p)));
        setEditingId(null);
      } else {
        setPosts([...posts, data]);
      }

      setTitle("");
      setContent("");
      setError(null);
    } catch {
      setError("Failed to save post");
    }
  };

  // Edit post
  const editPost = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content || "");
  };

  // Delete post
  const deletePost = async (id: number) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": API_TOKEN || "",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete post");
        return;
      }

      setPosts(posts.filter((p) => p.id !== id));
      setError(null);
    } catch {
      setError("Failed to delete post");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Posts</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={savePost}>{editingId ? "Update" : "Add"} Post</button>
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: "1rem" }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button
              onClick={() => editPost(post)}
              style={{ marginRight: "0.5rem" }}
            >
              Edit
            </button>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
