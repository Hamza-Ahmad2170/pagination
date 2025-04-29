import { useEffect, useState } from "react";
import { apiFetch } from "./lib/utils";
import Paginate from "./components/paginate-server";
import { useSearchParams } from "react-router";
import { useQueryState, parseAsInteger } from "nuqs";

interface Post {
  limit: number;
  posts: Todo[];
  skip: number;
  total: number;
}

interface Todo {
  body: string;
  id: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
  tags: string[];
  title: string;
  userId: number;
  views: number;
}

export default function App() {
  const [postsData, setPostsData] = useState<Post>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(5),
  );

  const totalPages = postsData?.total ? Math.ceil(postsData.total / limit) : 0;

  const handlePostsPerPageChange = (newLimit: number) => {
    // Preserve other params and update the limit

    // Reset to page 1 when changing items per page
    setPage(1);
    setLimit(newLimit);
  };

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const skip = (page - 1) * limit;
        const res = await apiFetch(`posts?limit=${limit}&skip=${skip}`);
        if (!res.ok) throw new Error("Something went wrong");
        const data: Post = await res.json();
        setPostsData(data);
      } catch (error) {
        console.error(error);

        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [limit, page]);

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen content-center px-4">
      <label htmlFor="posts-per-page">Posts per page:</label>
      <select
        id="posts-per-page"
        className="rounded border p-1"
        value={limit}
        onChange={(e) => handlePostsPerPageChange(Number(e.target.value))}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading posts...</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {postsData?.posts.map((item) => (
            <li key={item.id}>
              <h1 className="text-xl font-bold">{item.title}</h1>
              <p className="my-1.5">{item.body}</p>
              <p className="text-gray-60 text-sm">
                tags: {item.tags.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
      {/* pagination custom */}
      <Paginate
        totalPages={totalPages}
        currentPage={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
      />
    </div>
  );
}
