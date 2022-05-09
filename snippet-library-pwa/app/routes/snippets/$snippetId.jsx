import { useLoaderData, useCatch, useFormAction, json, redirect, Form } from "remix";
import connectDb from "~/db/connectDb.server.js";
import copyCode from  "~/components/copy.js";
import Editor from "@monaco-editor/react";
import { getSession } from "../sessions.js";


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
  const snippet = await db.models.Snippet.findById(params.snippetId);

  const session = await getSession(request.headers.get("Cookie"));
  const user = await db.models.User.findById(session.get("userId"));

  switch (formData.get("_method")) {
    case "delete":
      await db.models.Snippet.findByIdAndDelete(params.snippetId);
      return redirect("/snippets");
    case "favorite":
      console.log(user.username);
      if(user.favSnippets) {
        console.log("test")
      }
      else {
        db.models.User.update(
          { _id: user._id }, 
          { $push: { favSnippets: snippet._id } }
          
        );

        // user.favSnippets.push(snippet);
        // user.save();  

        // user.favSnippets = snippet._id ;
        // console.log(user.favSnippets);
      }

      snippet.favorite = !snippet.favorite;
      await snippet.save();
      console.log(snippet.favorite);
      return null;
    case "update":
      await db.models.Snippet.findByIdAndUpdate(params.snippetId, { title: formData.get("title"), lang: formData.get("lang"), code: formData.get("code"), description: formData.get("description") });
      return null;
      // const thisSnippet = await db.models.Snippet.findById(params.snippetId);
      // thisSnippet.code = formData.get("code");
      // await thisSnippet.save();
      // return null;
  }
}


export default function SnippetPage() {
  const snippet = useLoaderData();
    
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center content-center">
        <h2 className="text-2xl font-bold pr-4">{snippet.title}</h2>
        <Form method="post" className="">
          <input type="hidden" name="_method" value="favorite" />
          <button type="submit" className="text-2xl btn-secondary">
            <i className={snippet.favorite === true ? "ri-heart-fill" : "ri-heart-line"}></i>
          </button>
        </Form>
      </div>
      <div className="py-8">
        <label className="font-bold">Coding language:</label>
        <p className="pb-4">{snippet.lang}</p>
        <label className="font-bold">Description:</label>
        <p>{snippet.description}</p>
      </div>
      <Editor
        name="code"
        height="50vh"
        defaultLanguage="javascript"
        value={snippet.code}
      />
      {/* <code>
        <pre>
          <div className="relative lg:w-full xl:w-5/6">
          <textarea className="py-4 pl-4 pr-10 w-full height whitespace-pre-wrap outline-none bg-white" id="codeSnippet" cols="30" rows="10" readOnly value={snippet.code}></textarea>
          <button type="button" onClick={copyCode} className="copyButton text-2xl"><i className="ri-clipboard-line" id="copy-to"></i></button>
          </div>
        </pre>
      </code> */}
      <div className="flex flex-wrap py-4">
        {/* <input type="checkbox" className="openSidebarMenu open" id="openSidebarMenu"/>
        <label htmlFor="openSidebarMenu" className="sidebarIconToggle"></label>
        <div id="sidebarMenu" className="p-6 bg-slate-300 min-h-screen ">
            <Form method="post" className="flex flex-col w-10/12 mx-auto mt-6">
              <h2 className="text-2xl font-bold mb-4">Edit snippet</h2>
              <input type="hidden" name="_method" value="update" />
              <label htmlFor="title" className="">
                Snippet title
              </label>
              <input
                type="text"
                name="title"
                defaultValue={snippet.title}
                className="mb-4 text-slate-600 p-2"
              />
              <label htmlFor="lang" className="">
                Coding language
              </label>
              <input
                type="text"
                name="lang"
                defaultValue={snippet.lang}
                className="mb-4 text-slate-600 p-2"
              />
              <label htmlFor="code" className="">
                Code snippet
              </label>
              <textarea
                type="text"
                name="code"
                defaultValue={snippet.code}
                className="mb-4 text-slate-600 p-2 code"
              />
              <label htmlFor="description" className="">
                Description
              </label>
              <textarea
                type="text"
                name="description"
                defaultValue={snippet.description}
                className="text-slate-600 p-2"
              />
              <br />
              <div>
                <button  type="submit" className="my-4 btn-primary hover:bg-teal-800 text-white py-2 px-4 rounded">Save</button>
              </div>
            </Form>
        </div>
        <button type="submit" className="btn-primary hover:bg-teal-800 text-white py-2 px-4 rounded">
          Edit
        </button> */}
        <Form method="post">
            <input type="hidden" name="_method" value="update" />
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
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
