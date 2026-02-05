import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Show image preview immediately
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    let imagePath: string | null = null;

    try {
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, image, { upsert: true });

        if (uploadError) {
          alert(uploadError.message);
          setLoading(false);
          return;
        }

        imagePath = fileName;
      }

      const { error: insertError } = await supabase.from("blogs").insert([
        {
          title,
          content,
          image_url: imagePath,
        },
      ]);

      if (insertError) {
        alert(insertError.message);
        setLoading(false);
        return;
      }

      alert("Blog created successfully 🎉");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Create Blog</h2>

      <input
        type="text"
        placeholder="Blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <textarea
        placeholder="Blog content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: 12 }}
      />

      {/* Preview */}
      {preview && (
        <div
          style={{
            width: "100%",
            height: 200,
            marginBottom: 12,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #ddd",
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "10px 16px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Blog"}
      </button>
    </div>
  );
}
