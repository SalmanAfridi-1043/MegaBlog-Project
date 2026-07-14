import { Container, PostForm } from "../components";

function AddPost() {
  return (
    <div className="w-full py-10">
      <Container>
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            New Post
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Fill in the details and publish your article
          </p>
        </div>

        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
