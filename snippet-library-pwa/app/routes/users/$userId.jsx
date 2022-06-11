import { Form, json, redirect, useActionData, useLoaderData, Link } from "remix";
import { getSession, commitSession } from "../sessions.js";
import bcrypt from "bcryptjs";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params, request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    return json({
       user: await db.models.User.findById(params.userId),
    });
}

export default function UserPage() {
  const { user } = useLoaderData();

    return (
        <div className="pt-7 pb-3 m-4 grid xl:grid-cols-[400px_1fr] gap-4 grid-cols-1">
          <div>
            <h1 className="text-2xl font-bold mb-10">{user.username}'s profile</h1>  
          </div>
        </div>
      );
  
}
