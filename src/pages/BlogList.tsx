import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

/* ===== Styles ===== */
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
  padding: 16,
  marginBottom: 20,
  borderRadius: 10,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const image = {
  width: "100%",
  height: 200,
  objectFit: "cover" as const,
  borderRadius: 8,
  marginBottom: 12,
};

const content = {
  color: "#555",
  lineHeight: 1.6,
};

const viewLink = {
  display: "inline-block",
  marginTop: 10,
  color: "#2563eb",
  fontWeight: 500,
  textDecoration: "none",
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 12,
};

const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const dangerBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const secondaryBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 30,
};

/* ===== Component ===== */
export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (!error) setBlogs(data || []);
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  /* ===== Delete Blog ===== */
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      alert("Blog deleted 🗑️");
      fetchBlogs(); // refresh list
    }
  };

  /* ===== Logout ===== */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div style={container}>
      {/* Header */}
      <div style={header}>
        <h1>📚 Blog List</h1>
        <div>
          <Link to="/create">
            <button style={primaryBtn}>➕ Create Blog</button>
          </Link>
          <button onClick={handleLogout} style={{ ...primaryBtn, marginLeft: 10 }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Blogs */}
      {blogs.map((blog) => (
        <div key={blog.id} style={card}>
          {blog.image_url && (
            <img src={blog.image_url} alt="blog" style={image} />
          )}

          <h3>{blog.title}</h3>

          <p style={content}>
            {blog.content.length > 150
              ? blog.content.slice(0, 150) + "..."
              : blog.content}
          </p>

          <Link to={`/blog/${blog.id}`} style={viewLink}>
            Read more →
          </Link>

          {/* Actions */}
          <div style={actions}>
            <button
              style={secondaryBtn}
              onClick={() => navigate(`/editform/${blog.id}`)}
            >
              ✏️ Edit
            </button>

            <button
              style={dangerBtn}
              onClick={() => handleDelete(blog.id)}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div style={pagination}>
        <button
          style={secondaryBtn}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ⬅ Prev
        </button>

        <span style={{ margin: "0 12px" }}>Page {page}</span>

        <button
          style={secondaryBtn}
          onClick={() => setPage(page + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
