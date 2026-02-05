import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { v4 as uuid } from "uuid";

/* ===== Styles ===== */
const container = {
  maxWidth: 600,
  margin: "60px auto",
  padding: 24,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const button = {
  width: "100%",
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 500,
};

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(""); // ✅ PUBLIC URL
  const [loading, setLoading] = useState(true);

  /* ===== Fetch Blog ===== */
  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Failed to load blog");
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setImageUrl(data.image_url || "");
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  /* ===== Update Blog ===== */
  const handleUpdate = async () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    let updatedImageUrl = imageUrl;

    try {
      // Upload new image if selected
      if (image) {
        const fileName = `${uuid()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, image);

        if (uploadError) {
          alert(uploadError.message);
          return;
        }

        // ✅ SAVE PUBLIC URL (same as BlogForm)
        updatedImageUrl = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase
        .from("blogs")
        .update({
          title,
          content,
          image_url: updatedImageUrl,
        })
        .eq("id", id);

      if (error) {
        alert("Update failed: " + error.message);
        return;
      }

      alert("Blog updated successfully ✨");
      navigate("/bloglist");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={container}>
      {/* Back */}
      <button
        onClick={() => navigate("/bloglist")}
        style={{
          background: "none",
          border: "none",
          color: "#2563eb",
          cursor: "pointer",
          marginBottom: 16,
          fontWeight: 500,
        }}
      >
        ← Back to Blog List
      </button>

      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        ✏️ Edit Blog
      </h2>

      <input
        style={input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog title"
      />

      <textarea
        style={{ ...input, resize: "vertical" }}
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Blog content"
      />

      {/* Existing Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="blog"
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 12,
          }}
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        style={{ marginBottom: 16 }}
      />

      <button onClick={handleUpdate} style={button}>
        💾 Update Blog
      </button>
    </div>
  );
}
