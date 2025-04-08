import { useEffect, useState } from "react";
import { apiFetch } from "./lib/utils";
import Paginate from "./components/paginate-client";
import { useSearchParams } from "react-router";


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

  const [todo, setTodo] = useState<Post>();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);



  const totalPages = todo?.total ? Math.ceil(todo.total / limit) : 0;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const skip = (currentPage - 1) * limit;
        const res = await apiFetch(`posts?limit=${limit}&skip=${skip}`);
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        const data: Post = await res.json();
        setTodo(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [limit, currentPage]);

  if (loading) {
    return <div className="container mx-auto px-4 min-h-screen content-center">Loading...</div>;
  }


  return (
    <div className="container mx-auto px-4 min-h-screen content-center">
      <label htmlFor="postsPerPage">Posts per page</label>
      <select name="postsPerPage" id="" value={limit} onChange={(e) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
      }}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      <ul className="space-y-4 ">
        {todo?.posts.map((item) => (
          <li key={item.id}>
            <h1 className="text-xl font-bold">{item.title}</h1>
            <p className="my-1.5">{item.body}</p>
            <p className="text-sm text-gray-60">tags: {item.tags.join(", ")}</p>
          </li>
        ))}
      </ul>

      {/* pagination custom */}
      <Paginate totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}
