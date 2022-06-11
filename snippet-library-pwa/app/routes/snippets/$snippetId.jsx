import { useLoaderData, useCatch, useFormAction, json, redirect, Form, Link } from "remix";
import { getSession, commitSession } from "./../sessions.js";
import connectDb from "~/db/connectDb.server.js";
import copyCode from  "~/components/copy.js";
import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

export async function loader({ params, request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const snippet = await db.models.Snippet.findById(params.snippetId);
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
  const snippet = await db.models.Snippet.findById(params.snippetId);
  console.log(snippet.snippetId);
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


export default function SnippetPage() {
  const data = useLoaderData();
  const [snippetCode, setSnippetCode] = useState(data.snippet.code);

  function handleEditorChange(value, event) {
    setSnippetCode(value);
  }
  console.log(data.user.favorite);
  console.log(data.snippet._id);

  useEffect(() => {
    setSnippetCode(data.snippet.code)
  },[data.snippet.code])
   
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center content-center justify-between">
        <div className="flex flex-row items-center">
          <h2 className="text-2xl font-bold pr-4">{data.snippet.title}</h2>
          <Form method="post">
            <input type="hidden" name="_method" value="favorite" />
            <button type="submit" className="text-2xl btn-secondary">
              <i className={data.user.favorite.includes(data.snippet._id) ? "ri-heart-fill" : "ri-heart-line"}></i>
            </button>
          </Form>
        </div>
        <div className="text-xs flex flex-row gap-2 items-center">Added by: {data.allUsers?.map((user)=> data.snippet.uid.includes(user._id)?
          <div>
            {data.snippet.uid.includes(data.user._id)?
              <Link to={`/login`} className="py-1/2 px-3 bg-orange-200 w-fit h-min rounded-3xl flex flex-row gap-1 items-center hover:bg-orange-300">
                <i className="ri-account-circle-line text-orange-700 text-base"></i>
                <p className="text-xs font-semibold text-orange-700">You</p>
              </Link> 
             : <Link to={`/users/${user._id}`} className="py-1/2 px-3 bg-orange-200 w-fit h-min rounded-3xl flex flex-row gap-1 items-center hover:bg-orange-300">
             <i className="ri-account-circle-line text-orange-700 text-base"></i>
             <p className="text-xs font-semibold text-orange-700">{user.username}</p>
           </Link>  }
          </div>
          : "")
          }
        </div>
      </div>
      <div className="py-8">
        <label className="font-bold">Coding language:</label>
        <p className="pb-4">{data.snippet.lang}</p>
        <label className="font-bold">Description:</label>
        <p>{data.snippet.description}</p>
      </div>
      <Editor
        name="code"
        height="50vh"
        defaultLanguage="javascript"
        value={snippetCode}
        onChange={handleEditorChange}
      />
      <div className="flex flex-wrap py-4">
        <Form method="post">
            <input type="hidden" name="_method" value="update" />
            <input type="hidden" name="code" value={snippetCode} />
            <button type="submit" className="btn-primary hover:bg-teal-800 text-white py-2 px-4 rounded">
             Save
            </button>
        </Form>
        <Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <button type="submit" className="mx-4 btn-delete hover:bg-red-900 text-white py-2 px-4 rounded flex flex-wrap">
            <i className="ri-delete-bin-line px-1"></i> Delete
            </button>
        </Form>
      </div>
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
