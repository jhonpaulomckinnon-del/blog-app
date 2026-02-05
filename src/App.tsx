import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogList from "./pages/BlogList";
import BlogForm from "./pages/BlogForm";
import BlogView from "./pages/BlogView";
import EditBlog from "./pages/EditBlog";





export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/bloglist" element={<BlogList />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create" element={<BlogForm />} />
      <Route path="/edit/:id" element={<BlogForm />} />
      <Route path="/blog/:id" element={<BlogView />} />
      <Route path="/editform/:id" element={<EditBlog />} />
    </Routes>
  );
}
