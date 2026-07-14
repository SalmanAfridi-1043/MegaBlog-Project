import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref,
) {
  const id = useId();
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="inline-block pl-1 text-slate-300 font-medium text-sm" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        type={type}
        className={`px-4 py-2.5 rounded-xl bg-slate-950 text-slate-100 outline-none border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 duration-200 w-full transition-all placeholder:text-slate-600 ${className}`}
        ref={ref}
        id={id}
        {...props}
      />
    </div>
  );
});

export default Input;
