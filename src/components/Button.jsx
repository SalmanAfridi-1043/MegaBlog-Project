function Button({
  children,
  type = "button",
  bgColor = "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md hover:shadow-violet-500/20 active:scale-98 transition-all duration-200",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-6 py-2.5 rounded-xl font-semibold text-center inline-flex items-center justify-center ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
