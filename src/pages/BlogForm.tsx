import { supabase } from "../lib/supabase";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

export default function BlogForm() {
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value;
    const imageInput = form.elements.namedItem("image") as HTMLInputElement;

    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    let imageUrl = "";

    try {
      if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const fileName = `${uuid()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, file);

        if (uploadError) {
          alert(uploadError.message);
          return;
        }

        imageUrl = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase.from("blogs").insert({
        title,
        content,
        image_url: imageUrl,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Blog saved successfully 🎉");
      navigate("/bloglist");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "60px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Back button */}
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

      <h2 style={{ textAlign: "center", marginBottom: 20 }}>📝 Create Blog</h2>

      <form onSubmit={submit}>
        <input
          name="title"
          placeholder="Blog title"
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <textarea
          name="content"
          placeholder="Blog content"
          rows={6}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
            resize: "vertical",
          }}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          style={{ marginBottom: 16 }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Save Blog
        </button>
      </form>
    </div>
  );
}
