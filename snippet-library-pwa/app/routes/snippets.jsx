import { useLoaderData, useSearchParams, Link, Outlet, Form, useSubmit, json } from "remix";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "./sessions.js";

export async function loader({ request}) {
  const db = await connectDb();
  const url = new URL(request.url)

  const searchValue = url.searchParams.get("query");
  const snippets = await db.models.Snippet.find(searchValue ? {title: { $regex: new RegExp(searchValue, "i") },}: {});

  const session = await getSession(request.headers.get("Cookie"));

  return json ({
    snippets,
    user: await db.models.User.findById(session.get("userId")),
  });
}

export default function Index() {
  const data = useLoaderData();
  const submit = useSubmit();

  return (
    <div className="pt-7 pb-3 m-4 grid xl:grid-cols-[400px_1fr] gap-4 grid-cols-1">
      <div className="border-r">
        <h1 className="text-2xl font-bold mb-10">All snippets</h1>

        <Form method="GET" className="mr-4">
          <input onChange={e => submit(e.currentTarget.form)} type="text" name="query" placeholder="Search..." className="mb-4 text-slate-600 p-2 w-full rounded-md "/>
        </Form>
        <ul className="mt-5 list-disc mr-4">
          {data.snippets.map((snippet) => {
            return (
              <li key={snippet?.key} className="list-none p-2 border-l bg-slate-200 hover:bg-slate-300 mb-2 rounded-md flex items-center justify-between sm:w-full">
                <div className="flex items-center">
                  {data.user?.favorite?.includes(snippet._id) ? <i className={ "ri-heart-fill text-teal-700 mr-2"}></i> : "" }
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
