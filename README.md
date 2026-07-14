# MegaBlog

> A modern, full-stack blogging platform built with React and Appwrite — featuring rich content editing, user authentication, profile management, and a polished dark UI.

---

## ✨ Features

### 📝 Blog Posts
- Create, read, update, and delete blog posts
- Rich text editor powered by **TinyMCE** with full formatting support
- Drag-and-drop featured image upload with live preview
- Auto-generated URL slugs from post titles
- Post visibility control (Active / Inactive)
- Posts are protected — only the author can edit or delete their own posts

### 🔐 Authentication
- Email/password sign up and sign in
- Session-based auth via Appwrite
- Protected routes — unauthenticated users are redirected to login
- Persistent auth state via Redux

### 👤 Profile & Settings
- **Profile page** — read-only view of your account details (name, email, join date, status)
- **Settings page** — update your display name, email address, and password
- **Delete Account** — permanently removes all your posts and images, then signs you out
- User avatar with name initials and consistent color throughout the app

### 🎨 UI / UX
- Fully dark theme with `slate-900` base and violet/indigo accent palette
- Responsive layout — works on mobile, tablet, and desktop
- Animated navbar — hides on scroll down, reappears on scroll up
- Avatar dropdown in the navbar with profile/settings/logout
- Mobile hamburger menu with full navigation
- Drag-and-drop image upload zone on post forms
- Loading spinners and inline success/error feedback on all forms
- Animated SVG logo with a spinning orbit ring

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| State Management | Redux Toolkit |
| Routing | React Router v7 |
| Backend / BaaS | Appwrite (Cloud or Self-hosted) |
| Rich Text Editor | TinyMCE via `@tinymce/tinymce-react` |
| Forms | React Hook Form |
| HTML Parser | `html-react-parser` |

---

## 📁 Project Structure

```
src/
├── appwrite/
│   ├── auth.js          # Auth service (login, signup, update, delete sessions)
│   └── config.js        # Database & storage service (CRUD posts, file upload)
│
├── components/
│   ├── Header/          # Navbar with animated hide/show, avatar dropdown
│   ├── Footer/          # Minimal footer (home page only)
│   ├── post-form/       # PostForm — shared between Add Post and Edit Post
│   ├── AuthLayout.jsx   # Route protection wrapper
│   ├── Logo.jsx         # Animated SVG logo
│   ├── PostCard.jsx     # Post grid card (used on Home)
│   ├── Login.jsx        # Login form component
│   ├── Signup.jsx       # Signup form component
│   ├── Input.jsx        # Reusable input field
│   ├── Select.jsx       # Reusable select field
│   ├── Button.jsx       # Reusable button
│   └── RTE.jsx          # TinyMCE rich text editor wrapper
│
├── Pages/
│   ├── Home.jsx         # Post grid with "New Post" CTA
│   ├── AllPosts.jsx     # Searchable/filterable list view with author info
│   ├── Post.jsx         # Full post view with edit/delete for authors
│   ├── AddPost.jsx      # Create new post page
│   ├── EditPost.jsx     # Edit existing post page
│   ├── Login.jsx        # Login page
│   ├── Signup.jsx       # Signup page
│   ├── Profile.jsx      # Read-only profile card
│   └── Settings.jsx     # Account settings with danger zone
│
├── store/
│   ├── store.js         # Redux store
│   └── authSlice.js     # Auth state slice (login/logout)
│
├── conf/
│   └── conf.js          # Environment variable config
│
├── App.jsx              # Root layout (Header + Outlet + Footer)
└── main.jsx             # Router setup and app bootstrap
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- An [Appwrite](https://appwrite.io) project (Cloud or self-hosted)
- A [TinyMCE](https://www.tiny.cloud) API key (free tier available)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/megablog.git
cd megablog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

### 4. Set up Appwrite

In your Appwrite console:

**Database Collection** — Create a collection with these attributes:

| Attribute | Type | Required |
|---|---|---|
| `title` | String | ✅ |
| `content` | String (large) | ✅ |
| `featuredImage` | String | ✅ |
| `status` | String (enum: active, inactive) | ✅ |
| `userID` | String | ✅ |

**Collection Permissions** — Allow `read("any")`, `create("users")`, `update("users")`, `delete("users")`

**Storage Bucket** — Create a bucket and allow `read("any")`, `create("users")`, `delete("users")`

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📸 Pages Overview

| Page | Route | Auth Required |
|---|---|---|
| Home | `/` | No |
| All Posts | `/all-posts` | Yes |
| View Post | `/post/:slug` | No |
| Add Post | `/add-post` | Yes |
| Edit Post | `/edit-post/:slug` | Yes |
| Login | `/login` | No (redirects if logged in) |
| Sign Up | `/signup` | No (redirects if logged in) |
| Profile | `/profile` | Yes |
| Settings | `/settings` | Yes |

---

## 🔒 Security Notes

- All write operations (create, update, delete) are protected by Appwrite's permission system
- The frontend additionally checks `post.userID === currentUser.$id` before showing edit/delete controls
- Account deletion clears all posts and storage files before terminating sessions
- Password updates require the current password (enforced by Appwrite)
- Email changes require the current password (enforced by Appwrite)

---

## 🏗 Build for Production

```bash
npm run build
```

Output is in the `dist/` folder. Deploy to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

---

## 📄 License

MIT — feel free to use, modify, and distribute.

---

<div align="center">
  Built with ❤️ using React & Appwrite
</div>
