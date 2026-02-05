import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

/* ===== Same styles as BlogList ===== */
const container = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 20,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const image = {
  width: "100%",
  height: 300,
  objectFit: "cover" as const,
  borderRadius: 8,
  marginBottom: 16,
};

const content = {
  color: "#555",
  lineHeight: 1.7,
  fontSize: 16,
};

const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 6,
  cursor: "pointer",
  textDecoration: "none",
};

/* ===== Component ===== */
export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setBlog(data);
      }

      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: 60 }}>
        Loading blog...
      </p>
    );
  }

  if (!blog) {
    return (
      <p style={{ textAlign: "center", marginTop: 60 }}>
        Blog not found 😕
      </p>
    );
  }

  return (
    <div style={container}>
      {/* Header */}
      <div style={header}>
        <h1>📖 Blog Details</h1>
        <Link to="/bloglist" style={primaryBtn}>
          ← Back to Blog List
        </Link>
      </div>

      {/* Blog Card */}
      <div style={card}>
        {blog.image_url && (
          <img
            src={blog.image_url}
            alt={blog.title}
            style={image}
          />
        )}

        <h2 style={{ marginBottom: 12 }}>{blog.title}</h2>

        <p style={content}>{blog.content}</p>
      </div>
    </div>
  );
}
