import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import { getSession, commitSession } from "./sessions.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    const form = await request.formData();

    const user = await db.models.User.findOne({
        username: form.get("username").trim(),
        password: form.get("password").trim()
    }) 

    if(user) {
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
    return json({
       user: await db.models.User.findById(session.get("userId")),
    });
}

export default function Login() {
  const { user } = useLoaderData();
  const actionData = useActionData();

  if(!user) {
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
                type="text"
                name="password"
                id="password"
                className="mb-4 text-slate-600 p-2 w-96"
                />
                <button type="submit" className="btn-primary hover:bg-teal-800 text-white py-2 px-4 rounded">
                    Login
                </button>        
            </Form>
    
          </div>
        </div>
      );
  } else {
    return (
        <div className="pt-7 pb-3 m-4 grid xl:grid-cols-[400px_1fr] gap-4 grid-cols-1">
          <div>
            <h1 className="text-2xl font-bold mb-10">You are logged in as:</h1>
            <p className="mb-5">{user.username}</p>
    
            <Form method="post" action="/logout">
                <button type="submit" className="btn-delete hover:bg-red-900 text-white py-2 px-4 rounded">
                    Logout
                </button>        
            </Form>
    
          </div>
        </div>
      );
  }
  
}
