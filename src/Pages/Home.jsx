import { useState, useEffect } from "react";
import { Container, PostCard } from "../components/index";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    appwriteService
      .getAllPosts()
      .then((posts) => {
        if (posts) setPosts(posts.documents);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Loading posts…</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center py-20">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-4xl">
              {authStatus ? "✍️" : "🔒"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                {authStatus ? "No posts yet" : "Welcome to MegaBlog"}
              </h1>
              <p className="text-slate-400 max-w-sm">
                {authStatus
                  ? "Be the first to share something with the world."
                  : "Sign in to explore and create blog posts."}
              </p>
            </div>
            {authStatus ? (
              <Link
                to="/add-post"
                className="px-6 py-2.5 rounded-xl font-semibold bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 transition-all duration-200"
              >
                Create your first post
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl font-semibold bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 transition-all duration-200"
              >
                Sign in
              </Link>
            )}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <Container>
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Latest Posts
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              {posts.length} {posts.length === 1 ? "article" : "articles"} published
            </p>
          </div>
          {authStatus && (
            <Link
              to="/add-post"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/20 transition-all duration-200 whitespace-nowrap"
            >
              + New Post
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard key={post.$id} {...post} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
