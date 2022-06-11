import { useLoaderData, useCatch, json, redirect } from "remix";
import connectDb from "~/db/connectDb.server.js";
import { getSession, commitSession } from "./../sessions.js";
import SnippetPage from "~/routes/snippets/$snippetId.jsx";

export async function loader({ params,request }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  const session = await getSession(request.headers.get("Cookie"));
  if (!snippet) {
    throw new Response(`Couldn't find snippet with id ${params.snippetId}`, {
      status: 404,
    });
  }
  const user = await db.models.User.findById(session.get("userId"));
  const allUsers = await db.models.User.find();
  return json({
     user,
     snippet,
     allUsers,
  });
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const db = await connectDb();
  switch (formData.get("_method")) {
    case "delete":
      await db.models.Snippet.findByIdAndDelete(params.snippetId);
      return redirect("/snippets");
      case "favorite":
        const session = await getSession(request.headers.get("Cookie"));
        const db = await connectDb();
        const loggedUser= await db.models.User.findById(session.get("userId"));
        const snippetToSave = await db.models.Snippet.findById(params.snippetId);
        
        if(loggedUser.favorite.includes(snippetToSave._id)){
          await db.models.User.findByIdAndUpdate(session.get("userId"), {$pull: {favorite: snippetToSave._id} });
        }else{
          await db.models.User.findByIdAndUpdate(session.get("userId"), {$push: {favorite: snippetToSave._id} });
        }
        return null;
    case "update":
      const snippetToUpdate = await db.models.Snippet.findById(params.snippetId);
      await db.models.Snippet.findByIdAndUpdate(params.snippetId, { title: snippetToUpdate.title, lang: snippetToUpdate.lang, code: formData.get("code"), description: snippetToUpdate.description });
      return null;
  }
}

export default function Page() {
  const data = useLoaderData();
  return (
    <SnippetPage />
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
  if(error.message == "Failed to fetch"){
    return (
      <h1 className="text-red-500 font-bold">
        "You are offline. Please connect to the internet to proceed."
      </h1>
    );
  } else {
    return (
      <h1 className="text-red-500 font-bold">
        {error.name}: {error.message}
      </h1>
    );
  }
}
