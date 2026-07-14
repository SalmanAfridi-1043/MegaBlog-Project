import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userID === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) setPost(post);
          else navigate("/");
        })
        .catch((error) => {
          console.error("Post :: getPost :: error", error);
          navigate("/");
        });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    try {
      await appwriteService.deletePost(post.$id);
      await appwriteService.deleteFile(post.featuredImage);
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleting(false);
    }
  };

  if (!post) return null;

  return (
    <div className="min-h-screen bg-slate-900">

      {/* ── Full-width hero image ── */}
      <div className="w-full bg-slate-950 overflow-hidden" style={{ maxHeight: "520px" }}>
        <img
          src={appwriteService.getFilePreview(post.featuredImage)}
          alt={post.title}
          className="w-full h-full object-cover"
          style={{ maxHeight: "520px", width: "100%" }}
        />
      </div>

      {/* ── Content area ── */}
      <div className="py-10">
        <Container>
          <div className="max-w-3xl mx-auto">

            {/* Author action bar — only visible to the author */}
            {isAuthor && (
              <div className="flex items-center justify-between mb-8 px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-sm text-slate-400 font-medium">
                    You are the author
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link to={`/edit-post/${post.$id}`}>
                    <button className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 shadow-md hover:shadow-emerald-500/30">
                      ✏️ Edit Post
                    </button>
                  </Link>
                  <button
                    onClick={deletePost}
                    disabled={deleting}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-md hover:shadow-rose-500/30"
                  >
                    {deleting ? "Deleting…" : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            )}

            {/* Post title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-8">
              {post.title}
            </h1>

            {/* Divider */}
            <div className="w-16 h-1 rounded-full bg-linear-to-r from-violet-500 to-indigo-500 mb-8" />

            {/* Post content */}
            <div className="browser-css text-slate-300 leading-relaxed text-lg prose-headings:text-white">
              {parse(post.content || "")}
            </div>

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-slate-800">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors duration-200 font-medium"
              >
                ← Back to all posts
              </button>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}
