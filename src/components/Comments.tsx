import { supabase } from "../lib/supabase";
import { v4 as uuid } from "uuid";

export default function Comments({ blogId }: any) {
  const submit = async (e: any) => {
    e.preventDefault();
    const { content, image } = e.target;

    let imageUrl = "";
    if (image.files[0]) {
      const fileName = uuid();
      await supabase.storage
        .from("comment-images")
        .upload(fileName, image.files[0]);

      imageUrl = supabase.storage
        .from("comment-images")
        .getPublicUrl(fileName).data.publicUrl;
    }

    await supabase.from("comments").insert({
      blog_id: blogId,
      content: content.value,
      image_url: imageUrl,
    });
  };

  return (
    <form onSubmit={submit}>
      <input name="content" placeholder="Comment..." />
      <input type="file" name="image" />
      <button>Comment</button>
    </form>
  );
}
