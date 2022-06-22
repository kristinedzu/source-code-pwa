import { Form, json, redirect, useActionData, useLoaderData, NavLink } from "remix";
import { getSession, commitSession } from "../sessions.js";
import bcrypt from "bcryptjs";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params, request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    const user = await db.models.User.findById(params.userId);
    //const snippets = db.models.Snippet.find({uid: params.userId});
    const snippets = await db.models.Snippet.find({uid: params.userId});
    return json({
       user,
       snippets
    });
}

export default function UserPage() {
  const data = useLoaderData();

    return (
        
        <>
          <div className="pt-7 pb-3 m-4 flex flex-col">
            <div className="flex flex-row items-center mb-10 gap-1">
                <i className="ri-account-circle-line text-4xl"></i>
                <h2 className="text-2xl font-bold">{data.user.username}</h2>
            </div>
            <p className="text-lg font-semibold mb-2">{data.user.username}'s snippets</p>
            <ul className="mt-2 list-disc mr-4">
              {data.snippets.map((snippet) => {
                return (
                  <NavLink to={`/snippets/${snippet._id}`}>
                    {({ isActive }) => (
                      <> 
                        <li key={snippet?.key} className={isActive ? "list-none p-2 border-l bg-slate-300 mb-2 rounded-md flex items-center justify-between sm:w-full" : "list-none p-2 border-l bg-slate-200 hover:bg-slate-300 mb-2 rounded-md flex items-center justify-between sm:w-1/2"}>
                          <div className="flex items-center">
                            {snippet.title}
                          </div>
                          <div className="py-1 px-3 bg-indigo-200 w-fit h-min rounded-3xl justify-self-end">
                              <p className="text-xs font-semibold text-indigo-600">{snippet.lang}</p>
                          </div>
                        </li>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </ul>
          </div>
        </>
        
      );
  
}
