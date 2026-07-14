import { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Container } from "../components/index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Format ISO date → "14 Jul 2026"
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Strip HTML tags and truncate to N chars
function excerpt(html = "", max = 120) {
  const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max) + "…" : text;
}

// Derive initials from a name string (first + last initial)
function nameInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Derive initials from userID (first 2 chars uppercased) — fallback
function avatarInitials(uid = "") {
  return uid.slice(0, 2).toUpperCase() || "??";
}

// Consistent hue from a string
function uidColor(uid = "") {
  const hues = [262, 221, 142, 38, 328, 190, 0];
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  return hues[Math.abs(hash) % hues.length];
}

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "active" | "inactive"

  const currentUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    appwriteService
      .getAllPosts([])
      .then((res) => { if (res) setPosts(res.documents); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true : p.status === filter;
    return matchSearch && matchFilter;
  });

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

  return (
    <div className="w-full py-10">
      <Container>

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              All Posts
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              {filtered.length} of {posts.length}{" "}
              {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {/* Search + filter controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search posts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 w-full sm:w-56 transition-all duration-200"
              />
            </div>

            {/* Status filter */}
            <div className="flex rounded-xl border border-slate-700/50 overflow-hidden text-sm font-medium">
              {["all", "active", "inactive"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 capitalize transition-colors duration-150
                    ${filter === f
                      ? "bg-violet-600 text-white"
                      : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-3xl">
              📭
            </div>
            <p className="text-slate-400 font-medium">No posts match your search.</p>
            <button
              onClick={() => { setSearch(""); setFilter("all"); }}
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* ── List ── */
          <div className="flex flex-col gap-4">
            {filtered.map((post, idx) => {
              const hue = uidColor(post.userID);
              const isOwn = currentUser && post.userID === currentUser.$id;

              return (
                <Link
                  key={post.$id}
                  to={`/post/${post.$id}`}
                  className="group block"
                >
                  <div className="flex gap-5 bg-slate-800/40 border border-slate-700/40 hover:border-violet-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-0.5">

                    {/* Thumbnail */}
                    <div className="shrink-0 w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/40">
                      {post.featuredImage ? (
                        <img
                          src={appwriteService.getFilePreview(post.featuredImage)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-2xl">
                          🖼️
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 min-w-0 gap-2">

                      {/* Top row: title + status badge */}
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-violet-400 transition-colors duration-200 leading-snug line-clamp-1">
                          {post.title}
                        </h2>
                        <span
                          className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border
                            ${post.status === "active"
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              : "text-slate-500 bg-slate-700/30 border-slate-600/30"
                            }`}
                        >
                          {post.status}
                        </span>
                      </div>

                      {/* Excerpt */}
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 hidden sm:block">
                        {excerpt(post.content)}
                      </p>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-3 mt-auto pt-2 border-t border-slate-700/30">

                        {/* Author avatar + name */}
                        <div className="flex items-center gap-2">
                          {isOwn ? (
                            <>
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-slate-700/50"
                                style={{ backgroundColor: `hsl(${hue}, 60%, 42%)` }}
                                title={currentUser?.name || "You"}
                              >
                                {nameInitials(currentUser?.name || "U")}
                              </div>
                              <span className="text-xs font-medium text-slate-400">
                                {currentUser?.name || "You"}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                                You
                              </span>
                            </>
                          ) : (
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 ring-2 ring-slate-700/50 bg-slate-700"
                              title="Author"
                            >
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Divider */}
                        <span className="text-slate-700 text-base">·</span>

                        {/* Created date */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(post.$createdAt)}
                        </div>

                        {/* Updated date if different */}
                        {post.$updatedAt && post.$updatedAt !== post.$createdAt && (
                          <>
                            <span className="text-slate-700">·</span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Updated {formatDate(post.$updatedAt)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
