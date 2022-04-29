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
          <input onChange={e => submit(e.currentTarget.form)} type="text" name="query" placeholder="Search..." className="mb-4 text-slate-600 p-2 w-96"/>
        </Form>

        <ul className="mt-5 list-disc">
          {snippets.map((snippet) => {
            return (
              <li key={snippet._id} className="list-none p-2 border-l">
                <Link
                  to={`/snippets/${snippet._id}`}
                  className="text-blue-600 hover:underline">
                  {snippet.title}
                </Link>
                <i className={snippet.favorite === true ? "ri-heart-fill ml-1" : "ri-heart-line ml-1"}></i>
              </li>
            );
          })}
        </ul>
      </div>
      <Outlet />
    </div>
  );
}
