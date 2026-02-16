import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!email || !password) {
      alert("Please enter email and password");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Login failed: " + error.message);
    } else {
      alert("Login successful 🎉");
      navigate("/bloglist"); // Redirect to BlogList page
    }
  };

  return (
    <form
      onSubmit={login}
      className="card"
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>

      <input
        name="email"
        type="email"
        placeholder="Email"
        style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc" }}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc" }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          border: "none",
          borderRadius: 6,
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/register")}
        style={{
          width: "100%",
          padding: 10,
          border: "none",
          borderRadius: 6,
          background: "#e5e7eb",
          color: "#111",
          cursor: "pointer",
        }}
      >
        Go to Register
      </button>
    </form>
  );
}
