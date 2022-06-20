import { useLoaderData, useCatch, json, Link, useParams, Outlet } from "remix";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "./sessions.js";

export async function loader({ params, request }) {
  const db = await connectDb();
  const snippets = await db.models.Snippet.find({lang: params.lang});
  if (!snippets) {
    throw new Response(`Couldn't find snippet with language ${params.lang}`, {
      status: 404,
    });
  }
  const session = await getSession(request.headers.get("Cookie"));

  return json ({
    snippets,
    user: await db.models.User.findById(session.get("userId")),
  });
}

export default function SnippetsLangPage() {
  const { lang } = useParams()

  const data = useLoaderData();
  return (
    <div className="pt-7 pb-3 m-4 grid xl:grid-cols-[400px_1fr] gap-4 grid-cols-1">
      <div className="border-r">
        <h1 className="text-2xl font-bold mb-10">{lang}</h1>
        <ul className="mt-5 list-disc mr-4">
          {data.snippets.map((snippet) => {
            return (
              <li key={snippet._id} className="list-none p-2 border-l bg-slate-200 hover:bg-slate-300 mb-2 rounded-md flex items-center">
                {data.user?.favorite?.includes(snippet._id) ? <i className={ "ri-heart-fill text-teal-700 mr-2"}></i> : "" }
                <Link
                  to={`/${lang}/${snippet._id}`}
                  className="hover:underline">
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

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
