import React, { useId } from "react";

function Select({ options = [], label, className, ...props }, ref) {
  const id = useId();
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="inline-block pl-1 text-slate-300 font-medium text-sm" htmlFor={id}>{label}</label>}

      <select
        {...props}
        ref={ref}
        id={id}
        className={`px-4 py-2.5 rounded-xl bg-slate-950 text-slate-100 outline-none border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 duration-200 w-full transition-all ${className}`}
      >
        {options?.map((option) => (
          <option key={option} value={option} className="bg-slate-950 text-slate-100">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
