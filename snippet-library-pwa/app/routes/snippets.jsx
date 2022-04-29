import { useLoaderData, useSearchParams, Link, Outlet, Form, useSubmit } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ request}) {
  const db = await connectDb();
  const url = new URL(request.url)

  const searchValue = url.searchParams.get("query");
  const snippets = await db.models.Snippet.find(searchValue ? {title: { $regex: new RegExp(searchValue, "i") },}: {});

  return snippets;
}

export default function Index() {
  const snippets = useLoaderData();
  const submit = useSubmit();

  return (
    <div className="pt-7 pb-3 m-4 grid xl:grid-cols-[400px_1fr] gap-4 grid-cols-1">
      <div className="border-r">
        <h1 className="text-2xl font-bold mb-10">All snippets</h1>

        <Form method="GET">
          <input onChange={e => submit(e.currentTarget.form)} type="text" name="query" placeholder="Search..." className="mb-4 text-slate-600 p-2 w-96 rounded-md"/>
        </Form>

        <ul className="mt-5 list-disc mr-4">
          {snippets.map((snippet) => {
            return (
              <li key={snippet._id} className="list-none p-2 border-l bg-slate-200 hover:bg-slate-300 mb-2 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <i className={snippet.favorite === true ? "ri-heart-fill text-teal-700 mr-2" : "ri-heart-line mr-2"}></i>
                  <Link
                    to={`/snippets/${snippet._id}`}
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
