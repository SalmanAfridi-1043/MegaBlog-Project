import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import conf from "../conf/conf.js";

function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1 text-slate-300 font-medium">
          {label}
        </label>
      )}

      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => {
          const apiKey = conf.tinymceApiKey?.trim();

          if (!apiKey) {
            return (
              <div className="rounded-2xl border border-rose-500 bg-rose-500/10 p-4 text-rose-100">
                <strong className="block mb-2">
                  TinyMCE API key is missing.
                </strong>
                Please add{" "}
                <code className="bg-slate-900 px-1 rounded">
                  VITE_TINYMCE_API_KEY
                </code>{" "}
                to your <code>.env</code> file and restart the dev server.
              </div>
            );
          }

          return (
            <Editor
              apiKey={apiKey}
              value={field.value ?? defaultValue ?? ""}
              init={{
                skin: "oxide-dark",
                content_css: "dark",
                height: 500,
                menubar: true,
                plugins: [
                  "image",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={(content) => field.onChange(content)}
              onBlur={field.onBlur}
            />
          );
        }}
      ></Controller>
    </div>
  );
}

export default RTE;
