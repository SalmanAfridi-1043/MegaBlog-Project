import { useCallback, useEffect, useState, useRef } from "react";
import { Button, RTE, Input, Select } from "../index";
import { useForm } from "react-hook-form";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : null
  );
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, watch, setValue, control, getValues, reset } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        status: post.status,
      });
    }
  }, [post, reset]);

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  // Register the file input manually so we can also control it via drag-drop
  const { ref: rhfRef, onChange: rhfOnChange, ...imageRegisterProps } =
    register("image", { required: !post });

  const handleFileChange = (file) => {
    if (!file) return;
    // Update react-hook-form value
    const dt = new DataTransfer();
    dt.items.add(file);
    rhfOnChange({ target: { files: dt.files } });
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const submit = async (data) => {
    setError("");
    setSubmitting(true);
    try {
      if (post) {
        const file = data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage,
        });

        if (dbPost) navigate("/");
      } else {
        if (!data.image || data.image.length === 0) {
          throw new Error("Please select a featured image.");
        }
        const file = await appwriteService.uploadFile(data.image[0]);

        if (file) {
          data.featuredImage = file.$id;
          const dbPost = await appwriteService.createPost({
            ...data,
            userID: userData.$id,
          });
          if (dbPost) navigate("/");
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred while saving the post.");
    } finally {
      setSubmitting(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 36);
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full">

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl text-sm font-medium">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6">

        {/* ── LEFT: main content ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Post Details card */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/40 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h2 className="text-sm font-semibold text-slate-300 tracking-wide">Post Details</h2>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <Input
                label="Title"
                placeholder="Give your post a compelling title…"
                {...register("title", { required: true })}
              />
              {/* Slug row */}
              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-slate-300 font-medium text-sm">Slug</label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all duration-200 overflow-hidden">
                  <span className="px-3 py-2.5 text-slate-600 text-sm border-r border-slate-800 bg-slate-900/60 select-none whitespace-nowrap">
                    /post/
                  </span>
                  <input
                    placeholder="auto-generated-slug"
                    className="flex-1 px-3 py-2.5 bg-transparent text-slate-100 outline-none text-sm placeholder:text-slate-600"
                    {...register("slug", { required: true })}
                    onInput={(e) =>
                      setValue("slug", slugTransform(e.currentTarget.value), {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
                <p className="pl-1 text-xs text-slate-600">Auto-generated from title. You can edit it manually.</p>
              </div>
            </div>
          </div>

          {/* Content editor card */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/40 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h10" />
              </svg>
              <h2 className="text-sm font-semibold text-slate-300 tracking-wide">Content</h2>
            </div>
            <div className="p-6">
              <RTE
                name="content"
                control={control}
                defaultValue={getValues("content")}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: sidebar ── */}
        <div className="w-full xl:w-72 shrink-0 flex flex-col gap-5">

          {/* Publish card */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/40 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-sm font-semibold text-slate-300 tracking-wide">Publish</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">

              {/* Status toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-slate-300 font-medium text-sm">Visibility</label>
                <div className="flex rounded-xl border border-slate-700/50 overflow-hidden text-sm font-medium">
                  {["active", "inactive"].map((opt) => {
                    const isSelected = watch("status") === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setValue("status", opt)}
                        className={`flex-1 py-2.5 capitalize transition-colors duration-150 flex items-center justify-center gap-1.5
                          ${isSelected
                            ? opt === "active"
                              ? "bg-emerald-600/80 text-white"
                              : "bg-slate-700 text-slate-300"
                            : "bg-slate-800/60 text-slate-500 hover:text-slate-300 hover:bg-slate-700/40"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${opt === "active" ? "bg-emerald-300" : "bg-slate-500"}`} />
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {/* hidden select to keep react-hook-form in sync */}
                <select className="hidden" {...register("status", { required: true })}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200
                  ${post
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
                    : "bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving…
                  </>
                ) : post ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Post
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Publish Post
                  </>
                )}
              </button>

              {/* Cancel */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 border border-transparent hover:border-slate-700/50 transition-all duration-150 text-center"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Featured image card */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/40 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-sm font-semibold text-slate-300 tracking-wide">Featured Image</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">

              {/* Drag & drop upload zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith("image/")) handleFileChange(file);
                }}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
                  ${dragOver
                    ? "border-violet-400 bg-violet-500/10"
                    : "border-slate-700/60 hover:border-violet-500/50 hover:bg-slate-700/20"
                  }`}
              >
                {imagePreview ? (
                  /* Preview */
                  <div className="relative aspect-video">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="text-xs text-white font-semibold bg-slate-800/80 px-3 py-1.5 rounded-lg">
                        Click to change
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Empty drop zone */
                  <div className="aspect-video flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        Drop image here or <span className="text-violet-400">browse</span>
                      </p>
                      <p className="text-xs text-slate-600 mt-1">PNG, JPG, GIF · 16:9 recommended</p>
                    </div>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  className="hidden"
                  ref={(el) => {
                    rhfRef(el);
                    fileInputRef.current = el;
                  }}
                  onChange={(e) => {
                    rhfOnChange(e);
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setImagePreview(ev.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  {...imageRegisterProps}
                />
              </div>

              {/* Replace hint for edit mode */}
              {post && (
                <p className="text-xs text-slate-500 text-center">
                  Click above to replace the current image
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}

export default PostForm;
