import { useLoaderData, Link, Outlet, redirect } from "remix";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "./sessions.js";

export async function loader( {request} ) {
  const session = await getSession(request.headers.get("Cookie"));
  if(!session.has("userId")) {
    throw redirect('/login');
  } else {
    const db = await connectDb();
    const snippets = await db.models.Snippet.find();
    return snippets;
  }
  
}

export default function Index() {
  const snippets = useLoaderData();

  return (
    <div className="pt-7 pb-3 m-4 grid xl:grid-cols-[400px_1fr] gap-4 grid-cols-1">
      <div>
        <h1 className="text-2xl font-bold mb-10">My snippets</h1>
        <ul className="mt-5 list-disc">
          {snippets.filter(snippet => snippet.favorite === true).map((snippet) => {
            return (
              <li key={snippet._id} className="list-none p-2 border-l">
                <Link
                  to={`/favorite/${snippet._id}`}
                  className="text-blue-600 hover:underline">
                  {snippet.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <Outlet />

    </div>
  );
}
