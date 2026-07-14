import appwriteService from "../appwrite/config.js";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`} className="group block h-full">
      <div className="h-full flex flex-col bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10">
        {/* Thumbnail */}
        <div className="w-full overflow-hidden aspect-video bg-slate-900 shrink-0">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h2 className="text-base font-bold text-slate-100 group-hover:text-violet-400 transition-colors duration-200 line-clamp-2 leading-snug">
            {title}
          </h2>
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              Read article
            </span>
            <span className="text-violet-400 group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
