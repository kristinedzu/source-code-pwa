import { Form, json, redirect, useActionData, useLoaderData, Link } from "remix";
import { getSession, commitSession } from "./sessions.js";
import bcrypt from "bcryptjs";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    const form = await request.formData();

    const user = await db.models.User.findOne({
        username: form.get("username").trim(),
    }) 
    let isCorrectPassword = false;

    if(user) {
      isCorrectPassword = await bcrypt.compare(
        form.get("password").trim(),
        user.password
      )
    }

    if(user && isCorrectPassword) {
        session.set("userId", user._id);
        return redirect("/login", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } else {
        return json(
            { errorMessage: "User doesn't exist" },
            { status: 401}
        );
    }
    
}

export async function loader({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    loggedUserId = session.get("userId");
    const snippets = await db.models.Snippet.find({uid: loggedUserId});
    return json({
       user: await db.models.User.findById(session.get("userId")),
       snippets
    });
}

export default function Login() {
  const data = useLoaderData();
  const actionData = useActionData();

  console.log(data.snippets.length);

  if(!data.user) {
    return (
        <div className="pt-7 pb-3 m-4 grid xl:grid-cols-[400px_1fr] gap-4 grid-cols-1">
          <div>
            <h1 className="text-2xl font-bold mb-10">Sign in to your account</h1>
            <p className="text-red-500 text-xl font-bold mb-2">{actionData?.errorMessage}</p>
    
            <Form method="post">
                <label htmlFor="username" className="block">
                Username
                </label>
                <input
                type="text"
                name="username"
                id="username"
                className="mb-4 text-slate-600 p-2 w-96"
                />
                <label htmlFor="password" className="block">
                Password
                </label>
                <input
                type="password"
                name="password"
                id="password"
                className="mb-4 text-slate-600 p-2 w-96"
                />
                <button type="submit" className="btn-primary hover:bg-teal-800 text-white py-2 px-4 rounded">
                    Login
                </button>        
            </Form>
            <p className="mt-4">Don't have an account yet? <Link to="/signup" className="underline text-blue-600">Sign up now</Link></p>    
          </div>
        </div>
      );
  } else {
    return (
        <div className="pt-7 pb-3 m-4 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold mb-10">You are logged in as:</h1>
            <div className="flex flex-row items-center gap-1">
              <i className="ri-account-circle-line text-lg"></i>
              <p className="text-lg">{data.user.username}</p>
            </div>

            <div className="flex flex-row gap-4">
              <div className="flex flex-col items-center gap-2 p-6 bg-slate-200 w-fit rounded-md">
                <p>Your favourite snippets</p>
                <div className="flex flex-row items-center">
                  <i className="ri-heart-line mr-2"></i>
                  <p className="font-semibold">{data.user.favorite.length}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 p-6 bg-slate-200 w-fit rounded-md">
                <p>Your own snippets</p>
                <div className="flex flex-row items-center">
                  <i className="ri-book-open-line mr-2"></i>
                  <p className="font-semibold">{data.snippets.length}</p>
                </div>
              </div>
            </div>
          </div>
    
            <Form method="post" action="/logout">
                <button type="submit" className="btn-delete hover:bg-red-900 text-white py-2 px-4 rounded">
                    Logout
                </button>        
            </Form>
        </div>
      );
  }
  
}
