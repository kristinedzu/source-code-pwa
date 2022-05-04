import { useLoaderData, Link, Outlet, redirect, json } from "remix";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "./sessions.js";

export async function loader( {request} ) {
  const session = await getSession(request.headers.get("Cookie"));
  loggedUserId = session.get("userId");
  console.log(loggedUserId);
  if(!session.has("userId")) {
    throw redirect('/login');
  } else {
    const db = await connectDb();
    const snippets = await db.models.Snippet.find({uid: loggedUserId});
    return snippets;
  }
  
}

export default function Index() {
  const snippets = useLoaderData();

  return (
    <div className="pt-7 pb-3 m-4 grid xl:grid-cols-[400px_1fr] gap-4 grid-cols-1">
      <div className="border-r">
        <h1 className="text-2xl font-bold mb-10">My snippets</h1>
        <ul className="mt-5 list-disc mr-4">
          {snippets.map((snippet) => {
            return (
              <li key={snippet._id} className="list-none p-2 border-l bg-slate-200 hover:bg-slate-300 mb-2 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <i className={snippet.favorite === true ? "ri-heart-fill text-teal-700 mr-2" : ""}></i>
                  <Link
                    to={`/mysnippets/${snippet._id}`}
                    className="hover:underline">
                    {snippet.title}
                  </Link>
                </div>
                <div className="py-1 px-3 bg-indigo-200 w-fit h-min rounded-3xl justify-self-end">
                    <p className="text-xs font-semibold text-indigo-600">{snippet.lang}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <Outlet />

    </div>
  );
}
