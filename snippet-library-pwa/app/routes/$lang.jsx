import { useLoaderData, useCatch, json, Link, useParams, Outlet } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippets = await db.models.Snippet.find({lang: params.lang});
  if (!snippets) {
    throw new Response(`Couldn't find snippet with language ${params.lang}`, {
      status: 404,
    });
  }
  return snippets;
}

export default function SnippetsLangPage() {
  const { lang } = useParams()

  const snippets = useLoaderData();
  return (
    <div className="pt-7 pb-3 m-4 grid xl:grid-cols-[400px_1fr] gap-4 grid-cols-1">
      <div>
        <h1 className="text-2xl font-bold mb-10">{lang}</h1>
        <ul className="mt-5 list-disc">
          {snippets.map((snippet) => {
            return (
              <li key={snippet._id} className="list-none p-2 border-l">
                <Link
                  to={`/${lang}/${snippet._id}`}
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
