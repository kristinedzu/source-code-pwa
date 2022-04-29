import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";
import { getSession } from "./sessions.js";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    const newSnippet = await db.models.Snippet.create({ title: form.get("title"), lang: form.get("lang"), code: form.get("code"), description: form.get("description"), favorite: false });
    return redirect(`/snippets/${newSnippet._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if(!session.has("userId")) {
    throw redirect('/login');
  }
  else {
    return null;
  }
}

export default function CreateSnippet() {
  const actionData = useActionData();
  return (
    <div className="pt-7 pb-3 m-4">
      <h1 className="text-2xl font-bold mb-10">Add new snippet</h1>
      <Form method="post">
        <label htmlFor="title" className="block mb-1">
          Snippet title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title}
          id="title"
          className={
            actionData?.errors.title ? "border-2 border-red-500 mb-4 text-slate-600 p-2 w-96 rounded-md" : "mb-4 text-slate-600 p-2 w-96 rounded-md"
          }
        />
        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}
        <label htmlFor="lang" className="block mb-1">
          Coding language
        </label>
        <input
          type="text"
          name="lang"
          defaultValue={actionData?.values.lang}
          id="lang"
          className={
            actionData?.errors.lang ? "border-2 border-red-500 mb-4 text-slate-600 p-2 w-96 rounded-md" : "mb-4 text-slate-600 p-2 w-96 rounded-md"
          }
        />
        {actionData?.errors.lang && (
          <p className="text-red-500">{actionData.errors.lang.message}</p>
        )}
        <label htmlFor="code" className="block mb-1">
          Code snippet
        </label>
        <textarea
          type="text"
          name="code"
          defaultValue={actionData?.values.code}
          id="code"
          className={
            actionData?.errors.code ? "border-2 border-red-500 mb-4 text-slate-600 p-2 code w-96 rounded-md" : "mb-4 text-slate-600 p-2 code w-96 rounded-md"
          }
        />
        {actionData?.errors.code && (
          <p className="text-red-500">{actionData.errors.code.message}</p>
        )}
        <label htmlFor="description" className="block mb-1">
          Description
        </label>
        <input
          type="text"
          name="description"
          defaultValue={actionData?.values.description}
          id="description"
          className={
            actionData?.errors.description ? "border-2 border-red-500 mb-4 text-slate-600 p-2 w-96 rounded-md" : "mb-4 text-slate-600 p-2 w-96 rounded-md"
          }
        />
        {actionData?.errors.description && (
          <p className="text-red-500">{actionData.errors.description.message}</p>
        )}
        <br />

        <button type="submit" className="btn-primary hover:bg-teal-800 text-white py-2 px-4 rounded flex items-center"><i className="ri-add-line pr-1"></i>Add</button>
      </Form>
    </div>
  );
}
