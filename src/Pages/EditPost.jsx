import { useState, useEffect } from "react";
import { Container } from "../components/index";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/post-form/PostForm";

function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) setPost(post);
          else navigate("/");
        })
        .catch(() => navigate("/"))
        .finally(() => setLoading(false));
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Loading post…</p>
        </div>
      </div>
    );
  }

  return post ? (
    <div className="w-full py-10">
      <Container>
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Edit Post
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Update your post details below
          </p>
        </div>

        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
