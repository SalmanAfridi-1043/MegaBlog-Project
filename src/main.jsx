import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";

// Lazy-load all pages — each becomes its own separate chunk
const Home     = lazy(() => import("./Pages/Home.jsx"));
const AllPosts = lazy(() => import("./Pages/AllPosts.jsx"));
const Post     = lazy(() => import("./Pages/Post.jsx"));
const AddPost  = lazy(() => import("./Pages/AddPost.jsx"));
const EditPost = lazy(() => import("./Pages/EditPost.jsx"));
const Login    = lazy(() => import("./Pages/Login.jsx"));
const Signup   = lazy(() => import("./Pages/Signup.jsx"));
const Profile  = lazy(() => import("./Pages/Profile.jsx"));
const Settings = lazy(() => import("./Pages/Settings.jsx"));

// Minimal loading fallback
const PageLoader = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Suspense fallback={<PageLoader />}><Home /></Suspense>,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Suspense fallback={<PageLoader />}><Login /></Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Suspense fallback={<PageLoader />}><Signup /></Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<PageLoader />}><AllPosts /></Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<PageLoader />}><AddPost /></Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<PageLoader />}><EditPost /></Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: <Suspense fallback={<PageLoader />}><Post /></Suspense>,
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<PageLoader />}><Profile /></Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/settings",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<PageLoader />}><Settings /></Suspense>
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
