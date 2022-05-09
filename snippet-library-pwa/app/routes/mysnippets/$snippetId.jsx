import { useLoaderData, useCatch, json, redirect, Form } from "remix";
import connectDb from "~/db/connectDb.server.js";
import SnippetPage from "~/routes/snippets/$snippetId.jsx";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  if (!snippet) {
    throw new Response(`Couldn't find snippet with id ${params.snippetId}`, {
      status: 404,
    });
  }
  return json(snippet);
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const db = await connectDb();
  switch (formData.get("_method")) {
    case "delete":
      await db.models.Snippet.findByIdAndDelete(params.snippetId);
      return redirect("/snippets");
    case "favorite":
      const snippet = await db.models.Snippet.findById(params.snippetId);
      snippet.favorite = !snippet.favorite;
      await snippet.save();
      return null;
    case "update":
      const snippetToUpdate = await db.models.Snippet.findById(params.snippetId);
      await db.models.Snippet.findByIdAndUpdate(params.snippetId, { title: snippetToUpdate.title, lang: snippetToUpdate.lang, code: formData.get("code"), description: snippetToUpdate.description });
      return null;
  }
}

export default function Page() {
  const snippet = useLoaderData();
  return (
    <>
      <SnippetPage />
    </>
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
