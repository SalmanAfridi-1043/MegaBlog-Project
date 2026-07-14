import { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
    setError("");
    setLoading(true);
    try {
      const created = await authService.createAccount(data);
      if (created) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) dispatch(login(currentUser));
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[80vh] py-12 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-slate-800/80 shadow-2xl shadow-slate-950/50">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors duration-150">
                Sign in
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl text-sm font-medium mb-6">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(create)} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              placeholder="Your full name"
              {...register("name", { required: true })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Enter a valid email address",
                },
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              {...register("password", { required: true, minLength: 8 })}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </>
              ) : "Create Account"}
            </button>

            <p className="text-xs text-slate-600 text-center mt-1">
              By signing up you agree to our terms of service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
